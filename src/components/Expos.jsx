export default function Expos({ expos }) {
  if (!expos.length) return null;

  return (
    <section className="expos-wrap">
      <h2>Expo's</h2>
      <ul className="expos-list">
        {expos.map((expo) => (
          <li key={expo.id} className="expo-item">
            <strong className="expo-name">{expo.name}</strong>
            {expo.description && (
              <p className="expo-description">{expo.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
