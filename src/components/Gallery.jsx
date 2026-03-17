import { toLabel } from "../data/paintings";

export default function Gallery({ paintings, featuredIndex, onSelect }) {
  const featuredPainting = paintings[featuredIndex];

  return (
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
              onClick={() => onSelect(painting)}
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
  );
}
