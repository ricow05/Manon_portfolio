import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import ArtistStatement from "./components/ArtistStatement";
import Gallery from "./components/Gallery";
import PaintingModal from "./components/PaintingModal";
import AdminPanel from "./components/AdminPanel";
import Expos from "./components/Expos";

export default function App() {
  const [paintings, setPaintings] = useState([]);
  const [expos, setExpos] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [lang, setLang] = useState("nl");
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin"
  );

  async function fetchPaintings() {
    const { data, error } = await supabase
      .from("paintings")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setPaintings(data ?? []);
  }

  async function fetchExpos() {
    const { data, error } = await supabase
      .from("expos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (!error) setExpos(data ?? []);
  }

  useEffect(() => {
    fetchPaintings();
    fetchExpos();
  }, []);

  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!selectedPainting) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedPainting(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [selectedPainting]);

  if (isAdmin) {
    return <AdminPanel onSaved={() => { fetchPaintings(); fetchExpos(); }} />;
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1 className="page-title">Manon Van Pottelberg</h1>
        <button
          type="button"
          className="lang-toggle page-lang-toggle"
          onClick={() => setLang(lang === "nl" ? "en" : "nl")}
          aria-label="Toggle language"
        >
          {lang === "nl" ? "EN" : "NL"}
        </button>
        <button
          type="button"
          className="lang-toggle"
          onClick={() => { window.location.hash = "admin"; }}
          aria-label="Go to admin"
        >
          Admin
        </button>
      </header>
      <section className="card portfolio-panel">
        <ArtistStatement lang={lang} />
        <Gallery
          paintings={paintings}
          onSelect={setSelectedPainting}
        />
        <Expos expos={expos} />
      </section>
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </main>
  );
}
