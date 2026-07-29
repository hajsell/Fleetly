import { Link } from 'react-router'
import styles from './Navbar.module.scss'

function Navbar() {
  return (
    <header className={styles.header}>
      <nav className={styles.navbar} aria-label="Główna nawigacja">
        <Link className={styles.logo} to="/" aria-label="Fleetly — strona główna">
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

            <circle cx="12" cy="30" r="1.5" fill="white" />
            <circle cx="31" cy="30" r="1.5" fill="white" />
          </svg>

          <span>Fleetly</span>
        </Link>

        <div className={styles.center}>
          <a className={styles.link} href="/#about">
            O platformie
          </a>

          <a className={styles.link} href="/#how-it-works">
            Jak to działa
          </a>

          <a className={styles.link} href="/#for-providers">
            Dla przewoźników
          </a>
        </div>

        <div className={styles.auth}>
          <Link className={styles.authButton} to="/login">
            Zaloguj się
          </Link>

          <Link
            className={`${styles.authButton} ${styles.registerButton}`}
            to="/register"
          >
            Zarejestruj się
          </Link>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
