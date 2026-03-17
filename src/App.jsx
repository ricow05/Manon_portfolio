import { useEffect, useState } from "react";

const paintings = [
  "IMG_5653.jpg",
  "IMG_5657.jpg",
  "IMG_6058.jpg",
  "IMG_6059.jpg",
  "IMG_6060.jpg",
  "IMG_6061.jpg",
  "IMG_7822.jpg",
  "IMG_7822 2.jpg",
  "IMG_8389.jpg",
  "IMG_8396.jpg",
];

function toLabel(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
}

export default function App() {
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % paintings.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

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
            src={`./art-images/paintings/${encodeURIComponent(paintings[featuredIndex])}`}
            alt={paintings[featuredIndex]}
          />
          <p>Featured: {toLabel(paintings[featuredIndex])}</p>
        </article>

        <div className="grid">
          {paintings.map((name) => (
            <article className="card" key={name}>
              <img src={`./art-images/paintings/${encodeURIComponent(name)}`} alt={name} />
              <p>{toLabel(name)}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
