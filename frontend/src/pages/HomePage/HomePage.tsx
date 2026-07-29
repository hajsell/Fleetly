import { Link } from 'react-router'
import styles from './HomePage.module.scss'

const benefits = [
  {
    title: 'Zlecenia w jednym miejscu',
    description:
      'Publikuj przejazdy, przeglądaj ich status i trzymaj wszystkie szczegóły pod ręką.',
  },
  {
    title: 'Dostępna flota',
    description:
      'Przewoźnicy mogą szybko znaleźć zlecenia dopasowane do wolnych pojazdów.',
  },
  {
    title: 'Prosty przebieg realizacji',
    description:
      'Od przyjęcia zlecenia do zakończenia przejazdu — bez zbędnych etapów.',
  },
]

function HomePage() {
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Transport osób dla firm</p>

            <h1 className={styles.heroTitle}>
              Zlecenia transportowe bez zbędnych formalności
            </h1>

            <p className={styles.heroDescription}>
              Fleetly łączy firmy poszukujące transportu z przewoźnikami,
              którzy mają dostępne pojazdy i chcą sprawnie planować pracę.
            </p>

            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} to="/register">
                Zacznij korzystać
              </Link>

              <a className={styles.secondaryButton} href="#how-it-works">
                Zobacz, jak to działa
              </a>
            </div>
          </div>

          <div className={styles.orderPreview} aria-label="Przykładowe zlecenie">
            <div className={styles.previewHeader}>
              <div>
                <p className={styles.previewLabel}>Dostępne zlecenie</p>
                <p className={styles.orderNumber}>Zlecenie #1042</p>
              </div>

              <span className={styles.status}>Oczekuje</span>
            </div>

            <div className={styles.route}>
              <div className={styles.routeMarker} aria-hidden="true">
                <span />
                <span />
              </div>

              <div className={styles.routeAddresses}>
                <div>
                  <span>Początek trasy</span>
                  <strong>Warszawa, Centrum</strong>
                </div>

                <div>
                  <span>Miejsce docelowe</span>
                  <strong>Łódź, Śródmieście</strong>
                </div>
              </div>
            </div>

            <dl className={styles.orderDetails}>
              <div>
                <dt>Termin</dt>
                <dd>2 sierpnia, 09:30</dd>
              </div>

              <div>
                <dt>Pasażerowie</dt>
                <dd>18 osób</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className={styles.benefits} id="about">
        <div className={styles.sectionHeading}>
          <p className={styles.eyebrow}>Jedna platforma</p>
          <h2>Najważniejsze informacje zawsze pod ręką</h2>
          <p>
            Fleetly porządkuje współpracę między klientem a przewoźnikiem,
            pozostawiając tylko to, co naprawdę potrzebne.
          </p>
        </div>

        <div className={styles.benefitGrid}>
          {benefits.map((benefit, index) => (
            <article className={styles.benefit} key={benefit.title}>
              <span className={styles.benefitNumber}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.process} id="how-it-works">
        <div className={styles.processContent}>
          <div className={styles.processIntro}>
            <p className={styles.eyebrow}>Jak to działa</p>
            <h2>Dwie strony, jeden prosty proces</h2>
            <p>
              Klient określa potrzeby, a przewoźnik zajmuje się realizacją.
              Status zlecenia jest widoczny dla obu organizacji.
            </p>
          </div>

          <div className={styles.processColumns}>
            <article className={styles.processColumn} id="for-customers">
              <p className={styles.audience}>Dla klienta</p>
              <ol>
                <li>Dodaj trasę, termin i liczbę pasażerów.</li>
                <li>Poczekaj na przyjęcie zlecenia.</li>
                <li>Kontroluj jego aktualny status.</li>
              </ol>
            </article>

            <article className={styles.processColumn} id="for-providers">
              <p className={styles.audience}>Dla przewoźnika</p>
              <ol>
                <li>Przejrzyj dostępne zlecenia.</li>
                <li>Przyjmij przejazd i przypisz pojazd.</li>
                <li>Zarządzaj realizacją z jednego panelu.</li>
              </ol>
            </article>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div>
          <h2>Gotowy uporządkować transport?</h2>
          <p>Utwórz konto organizacji i zacznij pracę z Fleetly.</p>
        </div>

        <Link className={styles.primaryButton} to="/register">
          Załóż konto
        </Link>
      </section>
    </>
  )
}

export default HomePage
