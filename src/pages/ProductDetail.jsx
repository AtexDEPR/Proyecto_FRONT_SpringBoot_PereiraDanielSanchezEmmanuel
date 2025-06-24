"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ShoppingCart, Heart, Package, Calendar, CheckCircle, AlertCircle, Plus, Minus } from "lucide-react"
import { productService } from "../services/productService"
import { loteService } from "../services/loteService"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import LoadingSpinner from "../components/LoadingSpinner"
import toast from "react-hot-toast"

import AtunAceite from "../img/AtunAceite.webp"
import AtunAgua from "../img/AtunAgua.webp"
import AtunSalsa from "../img/AtunSalsa.webp"

const getProductImage = (conservante) => {
  switch (conservante) {
    case "ACEITE":
      return AtunAceite
    case "AGUA":
      return AtunAgua
    case "SALSA":
      return AtunSalsa
    default:
      return AtunAceite
  }
}

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, isInCart, getCartItemQuantity } = useCart()
  const { isAuthenticated } = useAuth()

  const [product, setProduct] = useState(null)
  const [availableLotes, setAvailableLotes] = useState([])
  const [selectedLote, setSelectedLote] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProductDetails()
  }, [id])

  const fetchProductDetails = async () => {
    try {
      setLoading(true)

      // Obtener detalles del producto
      const productResponse = await productService.getById(id)
      const productData = productResponse.success ? productResponse.data : productResponse

      console.log("=== PRODUCTO OBTENIDO ===")
      console.log("Producto:", productData)

      setProduct(productData)

      // Obtener lotes disponibles para este producto
      const lotesResponse = await loteService.getByProductId(id)
      const lotesData = lotesResponse.success ? lotesResponse.data : lotesResponse

      console.log("=== LOTES DISPONIBLES ===")
      console.log("Lotes para producto", id, ":", lotesData)

      // Filtrar solo lotes disponibles
      const lotesDisponibles = lotesData.filter((lote) => lote.estado === "DISPONIBLE" && lote.cantidadDisp > 0)

      console.log("Lotes disponibles filtrados:", lotesDisponibles)

      setAvailableLotes(lotesDisponibles)

      // Seleccionar el primer lote disponible por defecto
      if (lotesDisponibles.length > 0) {
        const mejorLote = lotesDisponibles.reduce((prev, current) =>
          prev.cantidadDisp > current.cantidadDisp ? prev : current,
        )
        setSelectedLote(mejorLote)
        console.log("Lote seleccionado por defecto:", mejorLote)
      }
    } catch (error) {
      console.error("Error al obtener producto:", error)
      setError("Error al cargar el producto")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error("Debes iniciar sesión para agregar productos al carrito")
      navigate("/login")
      return
    }

    if (!selectedLote) {
      toast.error("No hay lotes disponibles para este producto")
      return
    }

    if (quantity > selectedLote.cantidadDisp) {
      toast.error(`Solo hay ${selectedLote.cantidadDisp} unidades disponibles`)
      return
    }

    console.log("=== AGREGANDO AL CARRITO ===")
    console.log("Producto seleccionado:", product)
    console.log("Lote seleccionado:", selectedLote)
    console.log("Cantidad:", quantity)

    // ✅ CRÍTICO: Pasar el lote correcto
    addToCart(product, selectedLote, quantity)

    toast.success(`${quantity} ${product.nombre} agregado${quantity > 1 ? "s" : ""} al carrito`)
  }

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (selectedLote && newQuantity > selectedLote.cantidadDisp) {
      toast.error(`Solo hay ${selectedLote.cantidadDisp} unidades disponibles`)
      return
    }
    setQuantity(newQuantity)
  }

  const handleLoteChange = (lote) => {
    console.log("Cambiando a lote:", lote)
    setSelectedLote(lote)
    // Ajustar cantidad si excede la disponible
    if (quantity > lote.cantidadDisp) {
      setQuantity(lote.cantidadDisp)
    }
  }

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h2>
          <p className="text-gray-600 mb-6">El producto que buscas no existe</p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al Inicio
          </button>
        </div>
      </div>
    )
  }

  const currentCartQuantity = isInCart(product.idProducto, product.conservante)
    ? getCartItemQuantity(product.idProducto, product.conservante)
    : 0

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Botón de regreso */}
        <motion.button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Volver a Productos
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imagen del producto */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={getProductImage(product.conservante) || "/placeholder.svg"}
                alt={product.nombre}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Información adicional */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Contenido</p>
                <p className="font-semibold">{product.contenidoG}g</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Conservante</p>
                <p className="font-semibold">{product.conservante}</p>
              </div>
            </div>
          </motion.div>

          {/* Información del producto */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nombre}</h1>
              <p className="text-gray-600 text-lg">{product.descripcion}</p>
              <div className="flex items-center mt-4">
                <span className="text-3xl font-bold text-blue-600">${product.precioLista.toFixed(2)}</span>
                <span className="text-gray-500 ml-2">por unidad</span>
              </div>
            </div>

            {/* Selección de lote */}
            {availableLotes.length > 0 && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Lotes Disponibles
                </h3>
                <div className="space-y-3">
                  {availableLotes.map((lote) => (
                    <div
                      key={lote.idLote}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedLote?.idLote === lote.idLote
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleLoteChange(lote)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-gray-900">{lote.codigoLote}</p>
                          <p className="text-sm text-gray-600">
                            Vence: {new Date(lote.fechaVenc).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">{lote.cantidadDisp} disponibles</p>
                          <p className="text-xs text-gray-500">
                            Producido: {new Date(lote.fechaProd).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selección de cantidad */}
            {selectedLote && (
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Cantidad</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-3 font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-3 hover:bg-gray-100 transition-colors"
                      disabled={quantity >= selectedLote.cantidadDisp}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Máximo: {selectedLote.cantidadDisp} unidades</p>
                    {currentCartQuantity > 0 && (
                      <p className="text-blue-600">Ya tienes {currentCartQuantity} en el carrito</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Botones de acción */}
            <div className="space-y-4">
              <motion.button
                onClick={handleAddToCart}
                disabled={!selectedLote || availableLotes.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                whileHover={{ scale: selectedLote ? 1.02 : 1 }}
                whileTap={{ scale: selectedLote ? 0.98 : 1 }}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                {availableLotes.length === 0
                  ? "Sin Stock"
                  : `Agregar ${quantity} al Carrito - $${(product.precioLista * quantity).toFixed(2)}`}
              </motion.button>

              <motion.button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
                  isWishlisted
                    ? "bg-red-100 text-red-600 hover:bg-red-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Heart className={`w-5 h-5 mr-2 ${isWishlisted ? "fill-current" : ""}`} />
                {isWishlisted ? "Quitar de Favoritos" : "Agregar a Favoritos"}
              </motion.button>
            </div>

            {/* Información adicional */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Información del Producto</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">SKU:</span>
                  <span className="font-semibold">{product.codigoSku}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Peso:</span>
                  <span className="font-semibold">{product.contenidoG}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Conservante:</span>
                  <span className="font-semibold">{product.conservante}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Stock Mínimo:</span>
                  <span className="font-semibold">{product.stockMinimo} unidades</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
