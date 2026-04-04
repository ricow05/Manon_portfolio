import { useState, useRef } from "react";

// ─── config ───────────────────────────────────────────────────────────────────
const OWNER = "ricow05";
const REPO = "Manon_portfolio";
const SOURCE_BRANCH = "main";
const DEPLOYED_BRANCH = "gh-pages";
const DATA_SOURCE = "public/paintings.json";
const DATA_DEPLOYED = "paintings.json";
const IMG_SOURCE = "public/art-images/paintings/";
const IMG_DEPLOYED = "art-images/paintings/";
// ──────────────────────────────────────────────────────────────────────────────

function toB64(str) {
  const bytes = new TextEncoder().encode(str);
  return btoa(String.fromCharCode(...bytes));
}

async function ghFetch(token, method, path, body) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    }
  );
  return res;
}

async function getFile(token, branch, path) {
  const res = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${path}?ref=${branch}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub API error ${res.status}`);
  const data = await res.json();
  const content = new TextDecoder().decode(
    Uint8Array.from(atob(data.content.replace(/\n/g, "")), (c) =>
      c.charCodeAt(0)
    )
  );
  return { content, sha: data.sha };
}

async function putFile(token, branch, path, content, sha, message) {
  const body = { message, content: toB64(content), branch };
  if (sha) body.sha = sha;
  const res = await ghFetch(token, "PUT", path, body);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed (${res.status}): ${text}`);
  }
}

async function putBinaryFile(token, branch, path, base64, sha, message) {
  const body = { message, content: base64, branch };
  if (sha) body.sha = sha;
  const res = await ghFetch(token, "PUT", path, body);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed (${res.status}): ${text}`);
  }
}

export default function AdminPanel() {
  const [token, setToken] = useState(
    () => sessionStorage.getItem("admin_token") || ""
  );
  const [loggedIn, setLoggedIn] = useState(
    () => !!sessionStorage.getItem("admin_token")
  );
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success'|'error', text }
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const dragIdx = useRef(null);

  // ── auth ──────────────────────────────────────────────────────────────────

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Invalid token — make sure it has repo write access.");
      sessionStorage.setItem("admin_token", token);
      setLoggedIn(true);
      await loadPaintings(token);
    } catch (err) {
      setStatusMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    sessionStorage.removeItem("admin_token");
    setLoggedIn(false);
    setToken("");
    setPaintings([]);
    setStatusMsg(null);
  }

  // ── data loading ──────────────────────────────────────────────────────────

  async function loadPaintings(tok) {
    const t = tok ?? sessionStorage.getItem("admin_token");
    setLoading(true);
    setStatusMsg(null);
    try {
      // Prefer deployed branch (live data), fall back to source branch
      let file = await getFile(t, DEPLOYED_BRANCH, DATA_DEPLOYED);
      if (!file) file = await getFile(t, SOURCE_BRANCH, DATA_SOURCE);
      if (!file) {
        setPaintings([]);
        setStatusMsg({ type: "error", text: "paintings.json not found. Deploy the site first, then try again." });
        return;
      }
      setPaintings(JSON.parse(file.content));
    } catch (err) {
      setStatusMsg({ type: "error", text: "Could not load paintings: " + err.message });
    } finally {
      setLoading(false);
    }
  }

  // ── saving ────────────────────────────────────────────────────────────────

  async function save() {
    const t = sessionStorage.getItem("admin_token");
    setSaving(true);
    setStatusMsg(null);
    try {
      const json = JSON.stringify(paintings, null, 2);
      const [deployedFile, sourceFile] = await Promise.all([
        getFile(t, DEPLOYED_BRANCH, DATA_DEPLOYED),
        getFile(t, SOURCE_BRANCH, DATA_SOURCE),
      ]);
      await Promise.all([
        putFile(t, DEPLOYED_BRANCH, DATA_DEPLOYED, json, deployedFile?.sha, "Update paintings (admin panel)"),
        putFile(t, SOURCE_BRANCH, DATA_SOURCE, json, sourceFile?.sha, "Update paintings (admin panel)"),
      ]);
      setStatusMsg({ type: "success", text: "Saved! Changes are live on the site." });
    } catch (err) {
      setStatusMsg({ type: "error", text: "Save failed: " + err.message });
    } finally {
      setSaving(false);
    }
  }

  // ── image upload ──────────────────────────────────────────────────────────

  async function uploadImage(idx, file) {
    const t = sessionStorage.getItem("admin_token");
    setUploadingIdx(idx);
    setStatusMsg(null);
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const deployedPath = IMG_DEPLOYED + file.name;
      const sourcePath = IMG_SOURCE + file.name;

      const [existingDeployed, existingSource] = await Promise.all([
        getFile(t, DEPLOYED_BRANCH, deployedPath),
        getFile(t, SOURCE_BRANCH, sourcePath),
      ]);

      await Promise.all([
        putBinaryFile(t, DEPLOYED_BRANCH, deployedPath, base64, existingDeployed?.sha, `Upload ${file.name} (admin panel)`),
        putBinaryFile(t, SOURCE_BRANCH, sourcePath, base64, existingSource?.sha, `Upload ${file.name} (admin panel)`),
      ]);

      updatePainting(idx, "file", file.name);
      setStatusMsg({ type: "success", text: `Uploaded ${file.name}. Don't forget to save the list.` });
    } catch (err) {
      setStatusMsg({ type: "error", text: "Upload failed: " + err.message });
    } finally {
      setUploadingIdx(null);
    }
  }

  // ── list editing ──────────────────────────────────────────────────────────

  function updatePainting(idx, field, value) {
    setPaintings((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  }

  function deletePainting(idx) {
    if (!window.confirm("Remove this painting from the gallery list?\n(The image file on GitHub is not deleted.)")) return;
    setPaintings((prev) => prev.filter((_, i) => i !== idx));
  }

  function addPainting() {
    setPaintings((prev) => [
      ...prev,
      {
        file: "",
        year: String(new Date().getFullYear()),
        medium: "",
        dimensions: "",
        description: "",
      },
    ]);
  }

  // ── drag to reorder ───────────────────────────────────────────────────────

  function onDragStart(idx) {
    dragIdx.current = idx;
  }

  function onDragOver(e, idx) {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    setPaintings((prev) => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx.current, 1);
      arr.splice(idx, 0, moved);
      dragIdx.current = idx;
      return arr;
    });
  }

  function onDragEnd() {
    dragIdx.current = null;
  }

  // ── render ────────────────────────────────────────────────────────────────

  if (!loggedIn) {
    return (
      <div className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <h2 className="admin-login-title">Admin</h2>
          <p className="admin-hint">
            Enter a GitHub{" "}
            <a
              href="https://github.com/settings/tokens/new?scopes=repo&description=Portfolio+admin"
              target="_blank"
              rel="noopener noreferrer"
            >
              Personal Access Token
            </a>{" "}
            with <strong>repo</strong> write access.
          </p>
          <input
            className="admin-input"
            type="password"
            placeholder="github_pat_…"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            autoComplete="current-password"
            required
          />
          {statusMsg && (
            <p className={`admin-msg admin-msg--${statusMsg.type}`}>
              {statusMsg.text}
            </p>
          )}
          <button
            className="admin-btn admin-btn--primary"
            disabled={loading}
          >
            {loading ? "Verifying…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <h2 className="admin-toolbar-title">Gallery Editor</h2>
        <div className="admin-toolbar-actions">
          <button className="admin-btn admin-btn--ghost" onClick={logout}>
            Sign out
          </button>
          <button
            className="admin-btn admin-btn--primary"
            onClick={save}
            disabled={saving || loading}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {statusMsg && (
        <p className={`admin-msg admin-msg--${statusMsg.type}`}>
          {statusMsg.text}
        </p>
      )}

      {loading && <p className="admin-loading">Loading…</p>}

      <div className="admin-paintings">
        {paintings.map((p, idx) => (
          <div
            key={idx}
            className="admin-row"
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
          >
            <div className="admin-row-handle" title="Drag to reorder">
              ⠿
            </div>

            <div className="admin-row-thumb">
              {p.file ? (
                <img
                  src={`/art-images/paintings/${encodeURIComponent(p.file)}`}
                  alt={p.file}
                  className="admin-thumb"
                />
              ) : (
                <div className="admin-thumb admin-thumb--empty" />
              )}
              <label
                className={`admin-upload-btn${uploadingIdx === idx ? " admin-upload-btn--busy" : ""}`}
              >
                {uploadingIdx === idx
                  ? "Uploading…"
                  : p.file
                  ? "Replace photo"
                  : "Upload photo"}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  disabled={uploadingIdx !== null}
                  onChange={(e) =>
                    e.target.files[0] && uploadImage(idx, e.target.files[0])
                  }
                />
              </label>
              {p.file && (
                <span className="admin-filename">{p.file}</span>
              )}
            </div>

            <div className="admin-row-fields">
              <input
                className="admin-input admin-input--sm"
                placeholder="Year"
                value={p.year}
                onChange={(e) => updatePainting(idx, "year", e.target.value)}
              />
              <input
                className="admin-input admin-input--sm"
                placeholder="Medium"
                value={p.medium}
                onChange={(e) => updatePainting(idx, "medium", e.target.value)}
              />
              <input
                className="admin-input admin-input--sm"
                placeholder="Dimensions (e.g. 70 x 50 cm)"
                value={p.dimensions}
                onChange={(e) =>
                  updatePainting(idx, "dimensions", e.target.value)
                }
              />
              <textarea
                className="admin-input admin-textarea"
                placeholder="Description"
                value={p.description}
                rows={3}
                onChange={(e) =>
                  updatePainting(idx, "description", e.target.value)
                }
              />
            </div>

            <button
              className="admin-delete-btn"
              onClick={() => deletePainting(idx)}
              title="Remove from list"
              aria-label="Remove painting"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="admin-footer">
        <button
          className="admin-btn admin-btn--ghost"
          onClick={addPainting}
        >
          + Add painting
        </button>
        <button
          className="admin-btn admin-btn--primary"
          onClick={save}
          disabled={saving || loading}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
