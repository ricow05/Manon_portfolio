export default function Gallery({ paintings, onSelect }) {
  return (
    <section className="gallery-wrap">
      <h2>Paintings</h2>

      <div className="grid">
        {paintings.map((painting) => (
          <article className="painting-item" key={painting.id ?? painting.file}>
            <button
              type="button"
              className="painting-button"
              onClick={() => onSelect(painting)}
            >
              <img
                src={painting.image_url}
                alt={painting.name || painting.file}
              />
              <p className="painting-label">{painting.name || painting.file}</p>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
