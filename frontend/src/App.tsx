import { Route, Routes } from 'react-router'
import Navbar from './components/Navbar/Navbar'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/orders' element={<OrdersPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
