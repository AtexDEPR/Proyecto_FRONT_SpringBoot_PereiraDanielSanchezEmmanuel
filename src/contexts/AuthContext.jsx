"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import toast from "react-hot-toast"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        authService.setAuthToken(token)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login({
        nombreUsuario: credentials.nombreUsuario,
        contrasena: credentials.contrasena,
      })

      if (response.success) {
        const { token, nombreUsuario, correo, rol } = response.data

        // Crear objeto usuario con la estructura correcta
        const usuario = {
          nombreUsuario,
          correo,
          rol: { nombre: rol },
        }

        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(usuario))

        setUser(usuario)
        setIsAuthenticated(true)
        authService.setAuthToken(token)

        toast.success("¡Bienvenido!")
        return { success: true }
      } else {
        toast.error(response.message || "Error al iniciar sesión")
        return { success: false, message: response.message }
      }
    } catch (error) {
      console.error("Error en login:", error)
      const message = error.response?.data?.message || "Error al iniciar sesión"
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)

      if (response.success) {
        toast.success("Cuenta creada exitosamente. Por favor inicia sesión.")
        return { success: true }
      } else {
        toast.error(response.message || "Error al crear la cuenta")
        return { success: false, message: response.message }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Error al crear la cuenta"
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    setIsAuthenticated(false)
    authService.removeAuthToken()
    toast.success("Sesión cerrada")
  }

  const hasRole = (role) => {
    return user?.rol?.nombre === role
  }

  const getDashboardPath = () => {
    if (!user?.rol?.nombre) return "/"

    switch (user.rol.nombre) {
      case "ADMINISTRADOR":
        return "/admin/dashboard"
      case "OPERADOR":
        return "/operator/dashboard"
      default:
        return "/"
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    getDashboardPath,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
