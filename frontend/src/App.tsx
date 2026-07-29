import { Route, Routes } from 'react-router'
import HomePage from './pages/HomePage/HomePage'
import LoginPage from './pages/LoginPage/LoginPage'
import OrdersPage from './pages/OrdersPage/OrdersPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import PublicLayout from './layouts/PublicLayout/PublicLayout'

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path='/login' element={<LoginPage />} />
      <Route path='/orders' element={<OrdersPage />} />
      <Route path='*' element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
