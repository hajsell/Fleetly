import { Outlet } from 'react-router'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import styles from './PublicLayout.module.scss'

function PublicLayout() {
  return (
    <div className={styles.layout}>
      <Navbar />

      <main className={styles.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default PublicLayout
