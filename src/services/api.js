import axios from "axios"

// Configurar la URL base del API
const API_BASE_URL = "http://localhost:8080/api" // Context path del backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos de timeout
})

// Lista de endpoints que deberían ser públicos pero actualmente requieren auth
const SHOULD_BE_PUBLIC_ENDPOINTS = ["/productos", "/auth/login", "/auth/registro"]

// Función para verificar si un endpoint debería ser público
const shouldBePublicEndpoint = (url) => {
  return SHOULD_BE_PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint) || url.startsWith(endpoint))
}

// Interceptor para requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Log para debug - remover la URL duplicada
    const fullUrl = `${config.baseURL}${config.url}`
    console.log(`Making ${config.method?.toUpperCase()} request to: ${fullUrl}`)
    console.log("Authorization header:", config.headers.Authorization ? "Present" : "Missing")

    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Interceptor para responses
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error("Response interceptor error:", error)
    console.log("Full URL that failed:", error.config?.url)

    // Manejo específico para errores de timeout
    if (error.code === "ECONNABORTED") {
      console.warn(`Request timeout para ${error.config?.url}. Considera optimizar el endpoint.`)
    }

    // Manejo específico para errores 500
    if (error.response?.status === 500) {
      console.error(`Error interno del servidor en ${error.config?.url}:`, error.response?.data)
    }

    if (error.response?.status === 401) {
      const requestUrl = error.config?.url || ""

      // Si es un endpoint que debería ser público pero está devolviendo 401
      if (shouldBePublicEndpoint(requestUrl)) {
        console.warn(
          `Endpoint ${requestUrl} requiere autenticación pero debería ser público. ` +
            `Esto indica que el backend necesita configuración adicional.`,
        )
        // No limpiar localStorage para estos casos
        return Promise.reject(error)
      }

      // Solo limpiar token y redirigir para endpoints que realmente requieren autenticación
      console.log("Token inválido o expirado para endpoint protegido, limpiando localStorage")
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Solo redirigir si no estamos ya en login o register
      const currentPath = window.location.pathname
      if (currentPath !== "/login" && currentPath !== "/register" && currentPath !== "/") {
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  },
)

export default api
