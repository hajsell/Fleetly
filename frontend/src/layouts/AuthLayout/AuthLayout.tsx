import { Link, Outlet } from 'react-router'
import styles from './AuthLayout.module.scss'

function AuthLayout() {
  return (
    <div className={styles.layout}>
      <Link className={styles.logo} to="/">
        Fleetly
      </Link>

      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
