import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import BrowsePage from './pages/BrowsePage'
import CreateMealPage from './pages/CreateMealPage'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/signup"       element={<SignupPage />} />
          <Route path="/meals"        element={<BrowsePage />} />
          <Route path="/meals/create" element={
            <ProtectedRoute><CreateMealPage /></ProtectedRoute>
          } />
          <Route path="*"             element={<Navigate to="/meals" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App