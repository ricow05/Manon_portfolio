import { useEffect, useState } from "react";
import ArtistStatement from "./components/ArtistStatement";
import Gallery from "./components/Gallery";
import PaintingModal from "./components/PaintingModal";
import AdminPanel from "./components/AdminPanel";

export default function App() {
  const [paintings, setPaintings] = useState([]);
  const [selectedPainting, setSelectedPainting] = useState(null);
  const [lang, setLang] = useState("nl");
  const [isAdmin, setIsAdmin] = useState(
    () => window.location.hash === "#admin"
  );

  useEffect(() => {
    fetch("/paintings.json")
      .then((r) => r.json())
      .then(setPaintings)
      .catch(console.error);
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
    return <AdminPanel />;
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
      </header>
      <section className="card portfolio-panel">
        <ArtistStatement lang={lang} />
        <Gallery
          paintings={paintings}
          onSelect={setSelectedPainting}
        />
      </section>
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </main>
  );
}
