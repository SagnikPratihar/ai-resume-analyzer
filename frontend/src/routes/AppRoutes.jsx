import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage      from '@/pages/HomePage'
import LoginPage     from '@/pages/LoginPage'
import RegisterPage  from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = true
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"         element={<HomePage />} />
      <Route path="/login"    element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes