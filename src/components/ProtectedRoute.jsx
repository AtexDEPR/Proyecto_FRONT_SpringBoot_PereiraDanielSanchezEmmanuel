"use client"

import { useAuth } from "../contexts/AuthContext"
import { Navigate, useLocation } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated, hasRole } = useAuth()
  const location = useLocation()

  console.log("ProtectedRoute - Estado:", {
    user,
    loading,
    isAuthenticated,
    requiredRole,
    userRole: user?.rol,
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log("Usuario no autenticado, redirigiendo a login")
    // Redirigir al login y guardar la ubicación actual
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Si se requiere un rol específico, verificarlo usando la función hasRole
  if (requiredRole && !hasRole(requiredRole)) {
    console.log("Usuario no tiene el rol requerido:", {
      requiredRole,
      userRole: user?.rol,
      hasRequiredRole: hasRole(requiredRole),
    })
    // Si el usuario no tiene el rol requerido, redirigir al home
    return <Navigate to="/" replace />
  }

  console.log("Acceso permitido a ruta protegida")
  return children
}

export default ProtectedRoute
