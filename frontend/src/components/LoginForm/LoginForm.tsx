import { type FormEvent } from 'react'
import { Link } from 'react-router'
import styles from './LoginForm.module.scss'

function LoginForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h1>Zaloguj się</h1>
        <p>Wprowadź dane przypisane do Twojego konta Fleetly.</p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="email">Adres e-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="firma@example.com"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Hasło</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Wprowadź hasło"
            required
          />
        </div>
      </div>

      <button className={styles.submitButton} type="submit">
        Zaloguj się
      </button>

      <p className={styles.registerPrompt}>
        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </form>
  )
}

export default LoginForm
