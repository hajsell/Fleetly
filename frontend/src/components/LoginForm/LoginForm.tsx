import { type FormEvent, useState } from 'react'
import { Link } from 'react-router'
import { login } from '../../api/authApi'
import { ApiError } from '../../api/apiClient'
import type { LoginCredentials } from '../../types/auth.types'
import styles from './LoginForm.module.scss'

function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const credentials: LoginCredentials = {
      email: String(formData.get('email')).trim(),
      password: String(formData.get('password')),
    }

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await login(credentials)
      const userName = response.user.firstName ?? response.user.email

      setSuccessMessage(`Zalogowano pomyślnie. Witaj, ${userName}!`)
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie.',
      )
    } finally {
      setIsSubmitting(false)
    }
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
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {error && (
        <p className={`${styles.message} ${styles.error}`} role="alert">
          {error}
        </p>
      )}

      {successMessage && (
        <p
          className={`${styles.message} ${styles.success}`}
          role="status"
          aria-live="polite"
        >
          {successMessage}
        </p>
      )}

      <button
        className={styles.submitButton}
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        {isSubmitting ? 'Logowanie...' : 'Zaloguj się'}
      </button>

      <p className={styles.registerPrompt}>
        Nie masz jeszcze konta? <Link to="/register">Zarejestruj się</Link>
      </p>
    </form>
  )
}

export default LoginForm
