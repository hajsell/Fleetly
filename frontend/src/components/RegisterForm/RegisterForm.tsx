import { type FormEvent } from 'react'
import { Link } from 'react-router'
import styles from './RegisterForm.module.scss'

function RegisterForm() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="organizationType">Rodzaj organizacji</label>
          <select
            id="organizationType"
            name="organizationType"
            defaultValue=""
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
            required
          />
        </div>
      </div>

      <button className={styles.submitButton} type="submit">
        Utwórz konto
      </button>

      <p className={styles.loginPrompt}>
        Masz już konto? <Link to="/login">Zaloguj się</Link>
      </p>
    </form>
  )
}

export default RegisterForm
