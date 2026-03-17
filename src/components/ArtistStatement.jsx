const content = {
  nl: {
    descriptionTitle: "Artist Description",
    descriptionText:
      "Hallo. Ik ben Manon Van Pottelberg, een beeldend kunstenaar werkzaam in Gent en momenteel student aan LUCA School of Arts. Mijn artistieke praktijk heeft zich de afgelopen vier jaar toegespitst op de schilderkunst. Hierbij ligt mijn focus specifiek op het onderzoek naar de materiele voorbereiding van de drager, een proces dat een essentieel onderdeel vormt van mijn werk.",
    statementTitle: "Artist Statement",
    statementText:
      "Mijn werk is een doorlopend onderzoek naar de gelaagdheid van rouw en het vroege verlies van een moederfiguur. Deze persoonlijke thematiek vertaal ik naar het doek door hedendaagse beelden te vervlechten met klassieke symboliek uit de kunstgeschiedenis. Mijn artistieke keuzes zijn geworteld in het ambacht, ik werk voornamelijk met olieverf op linnen dat ik handmatig prepareer. Vaak vertrek ik vanuit een reeds aanwezige afdruk op de ondergrond, die als een herinnering of een spoor door de verflagen heen schemert. De resulterende beelden variëren tussen verstilde momentopnames en dynamische handelingen, waarmee ik de toeschouwer uitnodig om de emotionele complexiteit van mijn concepten te betreden.",
  },
  en: {
    descriptionTitle: "Artist Description",
    descriptionText:
      "Hello. I am Manon Van Pottelberg, a visual artist based in Ghent and currently a student at LUCA School of Arts. Over the past four years, my artistic practice has focused on painting. My focus lies specifically in researching the material preparation of the support, a process that forms an essential part of my work.",
    statementTitle: "Artist Statement",
    statementText:
      "My work is an ongoing investigation into the layers of grief and the early loss of a mother figure. I translate this personal theme onto the canvas by interweaving contemporary imagery with classical symbolism from art history. My artistic choices are rooted in craft. I work primarily with oil paint on linen that I prepare by hand. I often depart from an existing print already present on the surface, which shimmers through the layers of paint like a memory or a trace. The resulting images shift between hushed snapshots and dynamic gestures, inviting the viewer to enter the emotional complexity of my concepts.",
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
        </article>
      </div>

      <div className="artist-row artist-row-bottom">
        <article className="artist-statement-card statement-content">
          <h2>{statementTitle}</h2>
          <p>{statementText}</p>
        </article>

        <article className="artist-featured-card">
          <img
            src="./art-images/paintings/haar%20en%20oor.jpeg"
            alt="haar en oor"
          />
        </article>
      </div>
    </section>
  );
}
