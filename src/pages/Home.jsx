"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { productService } from "../services/productService"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"

// Importar las imágenes de productos
import AtunAceite from "../img/AtunAceite.webp"
import AtunAgua from "../img/AtunAgua.webp"
import AtunTomate from "../img/AtunSalsa.webp"
import Logo from "../img/Logo.png"

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterConservante, setFilterConservante] = useState("")

  const { addToCart } = useCart()
  const { isAuthenticated, user } = useAuth()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await productService.getAllProducts()
      console.log("Productos recibidos:", response)

      if (response.success && Array.isArray(response.data)) {
        setProducts(response.data)
      } else if (Array.isArray(response)) {
        setProducts(response)
      } else {
        console.error("Formato de respuesta inesperado:", response)
        setError("Error al cargar productos: formato de respuesta inválido")
      }
    } catch (error) {
      console.error("Error loading products:", error)
      if (error.response?.status === 401) {
        setError("Error de autorización al cargar productos")
      } else {
        setError("Error al cargar productos. Por favor intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  // Función para obtener la imagen correcta según el tipo de conservante
  const getProductImage = (conservante, nombre) => {
    switch (conservante) {
      case "ACEITE":
        return AtunAceite
      case "AGUA":
        return AtunAgua
      case "SALSA":
        return AtunTomate
      default:
        return AtunAceite // Imagen por defecto
    }
  }

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar productos al carrito")
      return
    }

    try {
      // Mapear los campos del backend al formato esperado por el carrito
      const cartProduct = {
        id: product.idProducto,
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precioLista,
        contenido_g: product.contenidoG,
        conservante: product.conservante,
      }

      addToCart(cartProduct)
      toast.success(`${product.nombre} agregado al carrito`)
    } catch (error) {
      console.error("Error al agregar al carrito:", error)
      toast.error("Error al agregar producto al carrito")
    }
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filterConservante || product.conservante === filterConservante
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img src={Logo || "/placeholder.svg"} alt="Atunes del Pacífico" className="w-24 h-24 object-contain" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Atunes del Pacífico</h1>
          <p className="text-xl md:text-2xl mb-8">Los mejores productos del mar, directo a tu mesa</p>
          {!isAuthenticated && (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Productos</h2>

          {error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-semibold text-red-800 mb-4">Error al cargar productos</h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                  onClick={loadProducts}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="mb-8 flex flex-col md:flex-row gap-4 justify-center">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={filterConservante}
                  onChange={(e) => setFilterConservante(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos los tipos</option>
                  <option value="ACEITE">En Aceite</option>
                  <option value="AGUA">Al Agua</option>
                  <option value="SALSA">En Salsa</option>
                </select>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {searchTerm || filterConservante
                      ? "No se encontraron productos con los filtros aplicados"
                      : "No hay productos disponibles"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.idProducto}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="h-48 bg-gray-50 flex items-center justify-center p-4">
                        <img
                          src={getProductImage(product.conservante, product.nombre) || "/placeholder.svg"}
                          alt={product.nombre}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(product.nombre)}`
                          }}
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">{product.nombre}</h3>
                        <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                          {product.descripcion || "Producto de alta calidad"}
                        </p>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-500">{product.contenidoG}g</span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {product.conservante === "ACEITE" && "En Aceite"}
                            {product.conservante === "AGUA" && "Al Agua"}
                            {product.conservante === "SALSA" && "En Salsa"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xl font-bold text-green-600">
                            ${product.precioLista?.toLocaleString() || "0"}
                          </span>
                          <div className="space-x-2">
                            <Link
                              to={`/product/${product.idProducto}`}
                              className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                            >
                              Ver
                            </Link>
                            {isAuthenticated ? (
                              <button
                                onClick={() => handleAddToCart(product)}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                              >
                                Agregar
                              </button>
                            ) : (
                              <Link
                                to="/login"
                                className="bg-gray-400 text-white px-3 py-1 rounded text-sm hover:bg-gray-500 transition-colors"
                              >
                                Login
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Sobre Nosotros</h2>
            <p className="text-lg text-gray-700 mb-6">
              Atunes del Pacífico S.A. es una empresa líder en la producción y distribución de productos de atún de la
              más alta calidad. Con años de experiencia en el sector, nos especializamos en ofrecer atún en aceite, al
              agua y en salsa, garantizando frescura y sabor en cada producto.
            </p>
            <p className="text-lg text-gray-700">
              Nuestro compromiso es brindar productos nutritivos y deliciosos, manteniendo los más altos estándares de
              calidad y sostenibilidad en todos nuestros procesos de producción.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
