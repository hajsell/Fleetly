import { Link } from 'react-router'
import styles from './Footer.module.scss'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <div className={styles.brand}>
          <Link
            className={styles.logo}
            to="/"
            aria-label="Fleetly — strona główna"
          >
            <svg
              className={styles.logoIcon}
              viewBox="0 0 40 40"
              aria-hidden="true"
            >
              <rect
                x="4"
                y="8"
                width="24"
                height="20"
                rx="4"
                fill="currentColor"
              />

              <path
                d="M28 15h4l5 6v7h-9V15Z"
                fill="currentColor"
              />

              <circle cx="12" cy="30" r="4" fill="currentColor" />
              <circle cx="31" cy="30" r="4" fill="currentColor" />

              <circle cx="12" cy="30" r="1.5" fill="#003152" />
              <circle cx="31" cy="30" r="1.5" fill="#003152" />
            </svg>

            <span>Fleetly</span>
          </Link>

          <p className={styles.description}>
            Fleetly łączy firmy poszukujące transportu osób z przewoźnikami
            posiadającymi dostępne pojazdy.
          </p>
        </div>

        <nav className={styles.navigation} aria-label="Nawigacja w stopce">
          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Platforma</h2>

            <a className={styles.link} href="/#how-it-works">
              Jak to działa
            </a>

            <a className={styles.link} href="/#about">
              O platformie
            </a>

            <a className={styles.link} href="/#for-customers">
              Dla klientów
            </a>

            <a className={styles.link} href="/#for-providers">
              Dla przewoźników
            </a>
          </div>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>Konto</h2>

            <Link className={styles.link} to="/login">
              Zaloguj się
            </Link>

            <Link className={styles.link} to="/register">
              Zarejestruj się
            </Link>

            <a className={styles.link} href="/#about">
              O projekcie
            </a>
          </div>
        </nav>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copyright}>
          © {currentYear} Fleetly. Projekt demonstracyjny.
        </p>
      </div>
    </footer>
  )
}

export default Footer
