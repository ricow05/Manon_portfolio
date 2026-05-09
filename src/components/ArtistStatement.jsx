const content = {
  nl: {
    descriptionTitle: "Artist Description",
    descriptionText:
      "Hallo. Ik ben Manon Van Pottelberg, een beeldend kunstenaar werkzaam in Gent en momenteel student aan LUCA School of Arts. Mijn artistieke praktijk heeft zich de afgelopen vier jaar toegespitst op de schilderkunst. Hierbij ligt mijn focus specifiek op het onderzoek naar de materiele voorbereiding van de drager, een proces dat een essentieel onderdeel vormt van mijn werk.",
    statementTitle: "Artist Statement",
    statementText:
      "Mijn laatste werk is een doorlopend onderzoek naar de gelaagdheid van rouw en het vroege verlies van een moederfiguur, (De Moeder-Dochterband). Het haar fungeert hier als een 'stille taal'. Het staat voor het doorgeven van tradities, het bieden van troost na verdriet, en het fysieke proces van opgroeien en loslaten. Deze persoonlijke thematiek vertaal ik naar het doek door hedendaagse beelden te vervlechten uit verschillende symbolieken. Mijn artistieke keuzes zijn geworteld in het werk, ik werk voornamelijk met olieverf op linnen dat ik handmatig prepareer. Vaak vertrek ik vanuit een reeds aanwezige afdruk op de ondergrond, die als een herinnering of een spoor door de verflagen heen schemert. De resulterende beelden variëren tussen verstilde momentopnames en dynamische handelingen, waarmee ik de toeschouwer uitnodig om de emotionele complexiteit van mijn concepten te betreden.",
  },
  en: {
    descriptionTitle: "Artist Description",
    descriptionText:
      "Hello. I am Manon Van Pottelberg, a visual artist based in Ghent and currently a student at LUCA School of Arts. Over the past four years, my artistic practice has focused on painting. My focus lies specifically in researching the material preparation of the support, a process that forms an essential part of my work.",
    statementTitle: "Artist Statement",
    statementText:
      "My latest work is an ongoing investigation into the layers of grief and the early loss of a mother figure (The Mother-Daughter Bond). Hair functions here as a 'silent language.' It represents the passing down of traditions, the offering of comfort after sorrow, and the physical process of growing up and letting go. I translate this personal theme onto the canvas by interweaving contemporary imagery from various symbolic systems. My artistic choices are rooted in the work itself — I work primarily with oil paint on linen that I prepare by hand. I often start from an impression already present on the surface, which shimmers through the layers of paint like a memory or a trace. The resulting images range between hushed snapshots and dynamic actions, through which I invite the viewer to enter the emotional complexity of my concepts."
  },
};

export default function ArtistStatement({ lang }) {
  const {
    descriptionTitle,
    descriptionText,
    statementTitle,
    statementText,
  } = content[lang];

  return (
    <section className="artist-layout">
      <div className="artist-row artist-row-top">
        <article className="artist-photo-card">
          <img src="./art-images/artist image.jpeg" alt="Artist" />
        </article>

        <article className="artist-description-card">
          <h1>{descriptionTitle}</h1>
          <p>{descriptionText}</p>
          <a
            href="https://www.instagram.com/oui_ou_manon?igsh=MWk1cTlnandmdms0aQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="artist-instagram-link"
          >
            <img src="./instagram logo.webp" alt="Instagram" />
          </a>
        </article>
      </div>

      <div className="artist-row artist-row-bottom">
        <article className="artist-statement-card statement-content">
          <h2>{statementTitle}</h2>
          <p>{statementText}</p>
        </article>

       
      </div>
    </section>
  );
}
