import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MealsPage from './pages/MealsPage'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/meals"  element={
            <ProtectedRoute><MealsPage /></ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/meals" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App