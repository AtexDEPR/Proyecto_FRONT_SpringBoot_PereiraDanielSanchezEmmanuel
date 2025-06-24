"use client"

import { createContext, useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { authService } from "../services/authService"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    setLoading(true)
    try {
      // Verificar si hay datos guardados
      const storedUser = localStorage.getItem("user")
      const storedToken = localStorage.getItem("token")

      console.log("Inicializando autenticación...")
      console.log("Token en localStorage:", storedToken ? "Presente" : "Ausente")
      console.log("Usuario en localStorage:", storedUser ? "Presente" : "Ausente")

      if (storedUser && storedToken) {
        try {
          const userData = JSON.parse(storedUser)

          // Validar estructura básica del usuario
          if (userData.nombreUsuario && userData.rol) {
            setUser(userData)
            console.log("Usuario restaurado desde localStorage:", userData)
            console.log("Rol del usuario:", userData.rol)
          } else {
            console.warn("Estructura de usuario inválida, limpiando datos")
            authService.clearAuth()
          }
        } catch (parseError) {
          console.error("Error parseando datos de usuario:", parseError)
          authService.clearAuth()
        }
      } else {
        console.log("No hay datos de autenticación guardados")
      }
    } catch (error) {
      console.error("Error inicializando autenticación:", error)
      authService.clearAuth()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      console.log("=== CONTEXTO LOGIN ===")
      console.log("Credenciales recibidas:", credentials)

      const result = await authService.login(credentials)
      console.log("Resultado del authService:", result)

      if (result.success) {
        const { token, ...userData } = result.data

        // Guardar datos del usuario (sin el token, que ya se guardó en authService)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(userData)

        console.log("Login exitoso en contexto:")
        console.log("- Usuario:", userData.nombreUsuario)
        console.log("- Rol:", userData.rol)
        console.log("- Correo:", userData.correo)

        return { success: true, user: userData }
      } else {
        console.error("Login fallido en contexto:", result.message)
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error("Error en contexto de login:", error)
      return { success: false, message: "Error interno al iniciar sesión" }
    }
  }

  const register = async (userData) => {
    try {
      console.log("=== CONTEXTO REGISTRO ===")
      console.log("Datos de registro recibidos:", userData)

      const result = await authService.register(userData)
      console.log("Resultado del registro:", result)

      if (result.success) {
        console.log("Registro exitoso en contexto")
        return { success: true, data: result.data }
      } else {
        console.error("Registro fallido en contexto:", result.message)
        return { success: false, message: result.message }
      }
    } catch (error) {
      console.error("Error en contexto de registro:", error)
      return { success: false, message: error.message || "Error interno al registrar usuario" }
    }
  }

  const logout = () => {
    console.log("Cerrando sesión...")
    authService.clearAuth()
    setUser(null)
    navigate("/login")
  }

  // Verificar si el usuario tiene un rol específico
  const hasRole = (roleName) => {
    if (!user || !user.rol) {
      return false
    }

    // Según tu backend, rol es un string directo
    const userRole = user.rol
    const result = userRole === roleName

    console.log(`Verificando rol ${roleName}:`, {
      userRole,
      requiredRole: roleName,
      hasRole: result,
    })

    return result
  }

  // Obtener nombre del rol
  const getRoleName = () => {
    return user?.rol || "Sin rol"
  }

  // Obtener ruta del dashboard según el rol
  const getDashboardPath = () => {
    if (!user?.rol) return "/"

    switch (user.rol) {
      case "ADMINISTRADOR":
        return "/admin/dashboard"
      case "OPERADOR":
        return "/operator/dashboard"
      case "CLIENTE":
        return "/"
      default:
        console.warn("Rol no reconocido:", user.rol)
        return "/"
    }
  }

  const value = {
    user,
    login,
    register, // ← Agregada la función register
    logout,
    loading,
    isAuthenticated: !!user,
    hasRole,
    getRoleName,
    getDashboardPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook personalizado
const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export { useAuth }
