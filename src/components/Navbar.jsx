"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, User, Menu, X, LogOut, Settings, History } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { useCart } from "../contexts/CartContext"
import Logo from "../img/Logo.png"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout, hasRole, getDashboardPath } = useAuth()
  const { getTotalItems } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
    setIsUserMenuOpen(false)
  }

  const handleDashboardClick = () => {
    const dashboardPath = getDashboardPath()
    navigate(dashboardPath)
    setIsUserMenuOpen(false)
  }

  // Función auxiliar para obtener el nombre del rol de forma segura
  const getRoleName = () => {
    if (!user || !user.rol) return "Usuario"
    return typeof user.rol === "string" ? user.rol : user.rol.nombre
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/" className="flex items-center space-x-3">
              <img src={Logo || "/placeholder.svg"} alt="Atunes del Pacífico" className="w-12 h-12 object-contain" />
              <span className="text-xl font-bold text-gray-900">Atunes del Pacífico</span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium">
              Inicio
            </Link>

            {isAuthenticated && !hasRole("ADMINISTRADOR") && !hasRole("OPERADOR") && (
              <Link
                to="/orders"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
              >
                Mis Pedidos
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart - Solo para clientes */}
            {isAuthenticated && !hasRole("ADMINISTRADOR") && !hasRole("OPERADOR") && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate("/cart")}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
              >
                <ShoppingCart className="w-6 h-6" />
                {getTotalItems() > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    {getTotalItems()}
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">{user?.nombreUsuario}</span>
                </motion.button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{user?.nombreUsuario}</p>
                        <p className="text-xs text-gray-500">{user?.correo}</p>
                        <p className="text-xs text-blue-600 font-medium">{getRoleName()}</p>
                      </div>

                      {/* Dashboard para Admin y Operador */}
                      {(hasRole("ADMINISTRADOR") || hasRole("OPERADOR")) && (
                        <button
                          onClick={handleDashboardClick}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Dashboard
                        </button>
                      )}

                      {/* Historial de pedidos solo para clientes */}
                      {!hasRole("ADMINISTRADOR") && !hasRole("OPERADOR") && (
                        <Link
                          to="/orders"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <History className="w-4 h-4 mr-2" />
                          Historial de Pedidos
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar Sesión
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Registrarse
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>

                {isAuthenticated ? (
                  <>
                    {/* Dashboard para Admin y Operador en móvil */}
                    {(hasRole("ADMINISTRADOR") || hasRole("OPERADOR")) && (
                      <button
                        onClick={() => {
                          handleDashboardClick()
                          setIsMenuOpen(false)
                        }}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                      >
                        Dashboard
                      </button>
                    )}

                    {/* Historial de pedidos solo para clientes en móvil */}
                    {!hasRole("ADMINISTRADOR") && !hasRole("OPERADOR") && (
                      <Link
                        to="/orders"
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Mis Pedidos
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="text-left text-red-600 hover:text-red-700 transition-colors duration-200 font-medium"
                    >
                      Cerrar Sesión
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Iniciar Sesión
                    </Link>
                    <Link
                      to="/register"
                      className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

export default Navbar
