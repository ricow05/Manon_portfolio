import { useEffect, useState } from "react";
import { paintings } from "./data/paintings";
import ArtistStatement from "./components/ArtistStatement";
import Gallery from "./components/Gallery";
import PaintingModal from "./components/PaintingModal";

export default function App() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [selectedPainting, setSelectedPainting] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % paintings.length);
    }, 3500);
    return () => clearInterval(timer);
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

  return (
    <main className="page">
      <ArtistStatement />
      <Gallery
        paintings={paintings}
        featuredIndex={featuredIndex}
        onSelect={setSelectedPainting}
      />
      <PaintingModal
        painting={selectedPainting}
        onClose={() => setSelectedPainting(null)}
      />
    </main>
  );
}
