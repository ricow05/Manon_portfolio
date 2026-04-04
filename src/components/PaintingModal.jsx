export default function PaintingModal({ painting, onClose }) {
  if (!painting) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
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
          onClick={onClose}
          aria-label="Close painting details"
        >
          x
        </button>
        <img
          className="modal-image"
          src={painting.image_url}
          alt={painting.file}
        />
        <div className="modal-content">
          <h3 id="painting-title">{painting.name || painting.file}</h3>
          <p>
            {painting.year} · {painting.medium}
          </p>
          <p>{painting.dimensions}</p>
          <p>{painting.description}</p>
        </div>
      </section>
    </div>
  );
}
