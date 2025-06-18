"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, ShoppingCart, Heart, Share2, Truck, Shield, RotateCcw, Award } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { productService } from "../services/productService"
import LoadingSpinner from "../components/LoadingSpinner"

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const data = await productService.getById(id)
      setProduct(data)
    } catch (err) {
      setError("Error al cargar el producto")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login")
      return
    }
    addToCart(product, quantity)
  }

  const productImages = [
    "/api/placeholder/500/500",
    "/api/placeholder/500/500",
    "/api/placeholder/500/500",
    "/api/placeholder/500/500",
  ]

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>
  if (!product) return <div className="text-center py-8">Producto no encontrado</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-lg shadow-lg overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Galería de Imágenes */}
            <div className="space-y-4">
              <motion.div
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={productImages[selectedImage] || "/placeholder.svg"}
                  alt={product.nombre}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="grid grid-cols-4 gap-2">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? "border-blue-600" : "border-transparent"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.nombre} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Información del Producto */}
            <div className="space-y-6">
              <div>
                <motion.h1
                  className="text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {product.nombre}
                </motion.h1>

                <motion.div
                  className="flex items-center space-x-2 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
                    ))}
                  </div>
                  <span className="text-blue-600 hover:underline cursor-pointer">(127 reseñas)</span>
                </motion.div>

                <motion.div
                  className="text-3xl font-bold text-blue-600 mb-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  ${product.precio?.toFixed(2)}
                </motion.div>
              </div>

              {/* Descripción */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.descripcion ||
                    "Atún premium de la más alta calidad, procesado con los mejores estándares para garantizar frescura y sabor excepcional."}
                </p>
              </motion.div>

              {/* Características */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h3 className="text-lg font-semibold mb-3">Características</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Tipo:</span>
                    <span className="ml-2 text-gray-600">{product.tipoConservante}</span>
                  </div>
                  <div>
                    <span className="font-medium">Peso:</span>
                    <span className="ml-2 text-gray-600">{product.peso || "185g"}</span>
                  </div>
                  <div>
                    <span className="font-medium">Stock:</span>
                    <span className="ml-2 text-green-600">{product.stock} disponibles</span>
                  </div>
                  <div>
                    <span className="font-medium">SKU:</span>
                    <span className="ml-2 text-gray-600">{product.id}</span>
                  </div>
                </div>
              </motion.div>

              {/* Cantidad y Botones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <div className="flex items-center space-x-4">
                  <label className="font-medium">Cantidad:</label>
                  <div className="flex items-center border rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    onClick={handleAddToCart}
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Agregar al Carrito</span>
                  </motion.button>

                  <motion.button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`p-3 rounded-lg border-2 transition-colors ${
                      isWishlisted
                        ? "border-red-500 text-red-500 bg-red-50"
                        : "border-gray-300 text-gray-600 hover:border-red-500 hover:text-red-500"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Heart className={`w-6 h-6 ${isWishlisted ? "fill-current" : ""}`} />
                  </motion.button>

                  <motion.button
                    className="p-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-6 h-6" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Beneficios */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="grid grid-cols-2 gap-4 pt-6 border-t"
              >
                <div className="flex items-center space-x-3">
                  <Truck className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Envío Gratis</div>
                    <div className="text-sm text-gray-600">En pedidos +$50</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">Garantía</div>
                    <div className="text-sm text-gray-600">100% Calidad</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="font-medium">Devoluciones</div>
                    <div className="text-sm text-gray-600">30 días</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  <div>
                    <div className="font-medium">Premium</div>
                    <div className="text-sm text-gray-600">Calidad superior</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProductDetail
