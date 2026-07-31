import { type FormEvent, useState } from 'react'
import { Link } from 'react-router'
import { register } from '../../api/authApi'
import styles from './RegisterForm.module.scss'
import type { RegisterData, OrganizationType } from '../../types/auth.types'
import { ApiError } from '../../api/apiClient'

function RegisterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if(isSubmitting) {
      return
    }

    const formData = new FormData(event.currentTarget)
    const data: RegisterData = {
      firstName: String(formData.get('firstName')).trim(),
      lastName: String(formData.get('lastName')).trim(),
      email: String(formData.get('email')).trim(),
      password: String(formData.get('password')),
      organizationType: formData.get('organizationType') as OrganizationType,
      organizationName: String(formData.get('organizationName')).trim(),
    }

    setIsSubmitting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await register(data)
      const userName = response.user.firstName ?? response.user.email

      setSuccessMessage(`Zarejestrowano pomyślnie. Witaj, ${userName}`)
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : 'Wystapil nieoczekiwany błąd. Spróbuj ponownie.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h1>Utwórz konto</h1>
        <p>
          Podaj swoje dane i informacje o organizacji, którą reprezentujesz.
        </p>
      </div>

      <div className={styles.fields}>
        <div className={styles.field}>
          <label htmlFor="firstName">Imię</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="Jan"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="lastName">Nazwisko</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            autoComplete="family-name"
            placeholder="Kowalski"
            disabled={isSubmitting}
            required
          />
        </div>

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
            autoComplete="new-password"
            placeholder="Co najmniej 8 znaków"
            minLength={8}
            disabled={isSubmitting}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="organizationType">Rodzaj organizacji</label>
          <select
            id="organizationType"
            name="organizationType"
            defaultValue=""
            disabled={isSubmitting}
            required
          >
            <option value="" disabled>
              Wybierz rodzaj organizacji
            </option>
            <option value="CUSTOMER">Firma poszukująca transportu</option>
            <option value="PROVIDER">Firma transportowa</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="organizationName">Nazwa organizacji</label>
          <input
            id="organizationName"
            name="organizationName"
            type="text"
            autoComplete="organization"
            placeholder="Nazwa firmy"
            minLength={2}
            maxLength={100}
            disabled={isSubmitting}
            required
          />
        </div>
      </div>

      {error && (
        <p className={`${styles.message} ${styles.error}`}
          role="alert"
        >
          {error}  
        </p>
      )}

      {successMessage && (
        <p className={`${styles.message} ${styles.success}`}
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
        {isSubmitting ? 'Rejestracja...' : 'Zarejestruj się' }
      </button>

      <p className={styles.loginPrompt}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </form>
  )
}

export default RegisterForm
