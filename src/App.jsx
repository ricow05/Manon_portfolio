import { useEffect, useState } from "react";

const paintings = [
  {
    file: "IMG_5653.jpg",
    year: "2024",
    medium: "Acrylic on canvas",
    dimensions: "70 x 50 cm",
    description:
      "A study in layered gestures that maps the tension between memory and place through repeated forms.",
  },
  {
    file: "IMG_5657.jpg",
    year: "2024",
    medium: "Mixed media on paper",
    dimensions: "42 x 30 cm",
    description:
      "This composition combines soft washes and sharp marks to suggest fragmented recollections.",
  },
  {
    file: "IMG_6058.jpg",
    year: "2025",
    medium: "Oil on panel",
    dimensions: "60 x 45 cm",
    description:
      "Muted color fields are interrupted by graphic lines, echoing architecture and emotional residue.",
  },
  {
    file: "IMG_6059.jpg",
    year: "2025",
    medium: "Oil and charcoal",
    dimensions: "60 x 45 cm",
    description:
      "This work explores erasure and rewriting, with charcoal forms surfacing beneath translucent paint.",
  },
  {
    file: "IMG_6060.jpg",
    year: "2025",
    medium: "Acrylic on canvas",
    dimensions: "80 x 60 cm",
    description:
      "Repetition drives the rhythm of the surface, turning ordinary motifs into emotional markers.",
  },
  {
    file: "IMG_6061.jpg",
    year: "2025",
    medium: "Mixed media on board",
    dimensions: "65 x 50 cm",
    description:
      "A denser palette and overlapping forms create a sense of accumulation and shifting perspective.",
  },
  {
    file: "IMG_7822.jpg",
    year: "2025",
    medium: "Oil on canvas",
    dimensions: "90 x 70 cm",
    description:
      "Broad brushwork and transparent glazes suggest a scene in transition, suspended between clarity and blur.",
  },
  {
    file: "IMG_7822 2.jpg",
    year: "2025",
    medium: "Oil on canvas",
    dimensions: "90 x 70 cm",
    description:
      "A companion variation that repositions the same visual language to emphasize spatial displacement.",
  },
  {
    file: "IMG_8389.jpg",
    year: "2026",
    medium: "Acrylic and graphite",
    dimensions: "50 x 40 cm",
    description:
      "Graphite lines frame the painted surface like traces of a map, suggesting routes through memory.",
  },
  {
    file: "IMG_8396.jpg",
    year: "2026",
    medium: "Mixed media",
    dimensions: "50 x 40 cm",
    description:
      "Contrasting textures and restrained color build a quiet narrative of intimacy and distance.",
  },
];

function toLabel(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
}

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

  const featuredPainting = paintings[featuredIndex];

  return (
    <main className="page">
      <section className="statement card">
        <div>
          <h1>Artist Statement</h1>
          <p>
            This project reflects on how everyday environments become emotional archives. Through
            repeated forms, layered marks, and altered photographs, I explore what is remembered,
            what is erased, and what is reconstructed over time.
          </p>
        </div>
        <img src="./art-images/image_artist.jpeg" alt="Artist" />
      </section>

      <section className="gallery-wrap">
        <h2>Paintings</h2>

        <article className="card featured">
          <img
            src={`./art-images/paintings/${encodeURIComponent(featuredPainting.file)}`}
            alt={featuredPainting.file}
          />
          <p>Featured: {toLabel(featuredPainting.file)}</p>
        </article>

        <div className="grid">
          {paintings.map((painting) => (
            <article className="card" key={painting.file}>
              <button
                type="button"
                className="painting-button"
                onClick={() => setSelectedPainting(painting)}
              >
                <img
                  src={`./art-images/paintings/${encodeURIComponent(painting.file)}`}
                  alt={painting.file}
                />
                <p>{toLabel(painting.file)}</p>
              </button>
            </article>
          ))}
        </div>
      </section>

      {selectedPainting && (
        <div className="modal-overlay" onClick={() => setSelectedPainting(null)} role="presentation">
          <section
            className="modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="painting-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedPainting(null)}
              aria-label="Close painting details"
            >
              x
            </button>
            <img
              className="modal-image"
              src={`./art-images/paintings/${encodeURIComponent(selectedPainting.file)}`}
              alt={selectedPainting.file}
            />
            <div className="modal-content">
              <h3 id="painting-title">{toLabel(selectedPainting.file)}</h3>
              <p>
                {selectedPainting.year} · {selectedPainting.medium}
              </p>
              <p>{selectedPainting.dimensions}</p>
              <p>{selectedPainting.description}</p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
