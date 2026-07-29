import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import AuthLayout from './layouts/AuthLayout/AuthLayout'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Route>
      <Route path='/orders' element={<OrdersPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
