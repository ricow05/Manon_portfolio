import { useState, useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";

const BUCKET = "paintings";

export default function AdminPanel({ onSaved }) {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success'|'error', text }
  const [uploadingIdx, setUploadingIdx] = useState(null);
  const dragIdx = useRef(null);

  // â”€â”€ auth â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadPaintings();
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setStatusMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setStatusMsg({ type: "error", text: error.message });
    else {
      await loadPaintings();
    }
    setLoading(false);
  }

  async function logout() {
    await supabase.auth.signOut();
    setPaintings([]);
    setStatusMsg(null);
  }

  // â”€â”€ data loading â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async function loadPaintings() {
    setLoading(true);
    setStatusMsg(null);
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) setStatusMsg({ type: "error", text: "Could not load paintings: " + error.message });
    else setPaintings(data ?? []);
    setLoading(false);
  }

  // â”€â”€ saving â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async function save() {
    setSaving(true);
    setStatusMsg(null);
    // Assign sort_order by current array position
    const rows = paintings.map((p, i) => ({ ...p, sort_order: i }));
    const { error } = await supabase.from("paintings").upsert(rows);
    if (error) {
      setStatusMsg({ type: "error", text: "Save failed: " + error.message });
    } else {
      setStatusMsg({ type: "success", text: "Saved! Changes are live." });
      onSaved?.();
    }
    setSaving(false);
  }

  // â”€â”€ image upload â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  async function uploadImage(idx, file) {
    setUploadingIdx(idx);
    setStatusMsg(null);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });
    if (uploadError) {
      setStatusMsg({
        type: "error",
        text: `Upload failed: ${uploadError.message} (status: ${uploadError.statusCode ?? "unknown"})`,
      });
      setUploadingIdx(null);
      return;
    }
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(uploadData.path);
    updatePainting(idx, "image_url", urlData.publicUrl);
    updatePainting(idx, "file", file.name);
    setStatusMsg({ type: "success", text: `Uploaded ${file.name}. Don't forget to save.` });
    setUploadingIdx(null);
  }

  // â”€â”€ list editing â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  function updatePainting(idx, field, value) {
    setPaintings((prev) =>
      prev.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );
  }

  async function deletePainting(idx) {
    const p = paintings[idx];
    if (!window.confirm("Remove this painting from the gallery?")) return;
    if (p.id) {
      const { error } = await supabase.from("paintings").delete().eq("id", p.id);
      if (error) {
        setStatusMsg({ type: "error", text: "Delete failed: " + error.message });
        return;
      }
    }
    setPaintings((prev) => prev.filter((_, i) => i !== idx));
    onSaved?.();
  }

  function addPainting() {
    setPaintings((prev) => [
      ...prev,
      {
        file: "",
        image_url: "",
        name: "",
        year: String(new Date().getFullYear()),
        medium: "",
        dimensions: "",
        description: "",
        sort_order: prev.length,
      },
    ]);
  }

  // â”€â”€ drag to reorder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

  // â”€â”€ render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  if (!session) {
    return (
      <div className="admin-page">
        <form className="admin-login" onSubmit={login}>
          <h2 className="admin-login-title">Admin</h2>
          <input
            className="admin-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            className="admin-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {statusMsg && (
            <p className={`admin-msg admin-msg--${statusMsg.type}`}>
              {statusMsg.text}
            </p>
          )}
          <button className="admin-btn admin-btn--primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign in"}
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
          <a
            className="admin-btn admin-btn--ghost"
            href="#"
            onClick={(e) => { e.preventDefault(); window.location.hash = ""; }}
          >
            ← View site
          </a>
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
            key={p.id ?? idx}
            className="admin-row"
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={(e) => onDragOver(e, idx)}
            onDragEnd={onDragEnd}
          >
            <div className="admin-row-handle" title="Drag to reorder">
              â ¿
            </div>

            <div className="admin-row-thumb">
              {p.image_url ? (
                <img
                  src={p.image_url}
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
                  : p.image_url
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
                placeholder="Name"
                value={p.name}
                onChange={(e) => updatePainting(idx, "name", e.target.value)}
              />
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
              âœ•
            </button>
          </div>
        ))}
      </div>

      <div className="admin-footer">
        <button className="admin-btn admin-btn--ghost" onClick={addPainting}>
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