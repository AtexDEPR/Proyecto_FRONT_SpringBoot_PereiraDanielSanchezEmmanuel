"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from "lucide-react"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import { orderService } from "../services/orderService"
import toast from "react-hot-toast"

import AtunAceite from "../img/AtunAceite.webp"
import AtunAgua from "../img/AtunAgua.webp"
import AtunSalsa from "../img/AtunSalsa.webp"

// Función para obtener la imagen correcta según el tipo de conservante
const getProductImage = (conservante) => {
  switch (conservante) {
    case "ACEITE":
      return AtunAceite
    case "AGUA":
      return AtunAgua
    case "SALSA":
      return AtunSalsa
    default:
      return AtunAceite // Imagen por defecto
  }
}

const Cart = () => {
  const navigate = useNavigate()
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotal,
    getItemCount,
    getSubtotal,
    getDiscount,
    getShipping,
  } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login")
    }
  }, [isAuthenticated, navigate])

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId)
    } else {
      updateQuantity(productId, newQuantity)
    }
  }

  const handleCheckout = async () => {
    if (items.length === 0) {
      toast.error("El carrito está vacío")
      return
    }

    if (!user) {
      toast.error("Debes iniciar sesión para realizar un pedido")
      navigate("/login")
      return
    }

    try {
      setLoading(true)

      const orderData = {
        fechaEntrega: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        metodoPago: "TRANSFERENCIA",
        detalles: items.map((item) => ({
          loteId: Number.parseInt(item.loteId || item.idLote || 1),
          cantidad: Number.parseInt(item.quantity || 1),
          precioUnitario: Number.parseFloat(item.precio_lista || item.precioLista || item.precio || 0),
          descuentoPct: 0,
          descuentoValor: 0,
        })),
      }

      console.log("Enviando pedido:", orderData)

      const response = await orderService.create(orderData)
      console.log("Respuesta del servidor:", response)

      // Ahora la respuesta tiene estructura estándar: { success: boolean, message: string, data: PedidoResponse }
      if (response.success) {
        const pedidoData = response.data
        toast.success(`¡Pedido creado exitosamente! Número: ${pedidoData.numeroPedido}`)

        clearCart()

        setTimeout(() => {
          navigate("/orders", {
            state: {
              message: "Pedido creado exitosamente",
              orderId: pedidoData.idPedido,
              orderNumber: pedidoData.numeroPedido,
            },
          })
        }, 1500)
      } else {
        toast.error(response.error || response.message || "Error al crear el pedido")
      }
    } catch (error) {
      console.error("Error en checkout:", error)

      if (error.response?.data?.success === false) {
        toast.error(error.response.data.error || "Error del servidor")
      } else {
        toast.error("Error al procesar el pedido")
      }
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Requerido</h2>
          <p className="text-gray-600 mb-6">Debes iniciar sesión para ver tu carrito</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/" className="flex items-center text-blue-600 hover:text-blue-700 transition-colors mr-4">
              <ArrowLeft className="w-5 h-5 mr-1" />
              Seguir Comprando
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrito de Compras</h1>
          <p className="text-gray-600">{getItemCount()} productos en tu carrito</p>
        </motion.div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Tu carrito está vacío</h2>
            <p className="text-gray-600 mb-6">Agrega algunos productos para comenzar</p>
            <Link
              to="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Explorar Productos
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Productos</h2>
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id_producto || item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={getProductImage(item.conservante) || "/placeholder.svg"}
                              alt={item.nombre}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = `/placeholder.svg?height=64&width=64&text=${encodeURIComponent(item.nombre)}`
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.nombre}</h3>
                            <p className="text-sm text-gray-600">{item.descripcion}</p>
                            <p className="text-lg font-bold text-blue-600">
                              ${(item.precio_lista || item.precioLista || item.precio || 0).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.id_producto || item.id, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={loading}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.id_producto || item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 transition-colors"
                              disabled={loading}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.id_producto || item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={loading}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-lg shadow-lg p-6 sticky top-8"
              >
                <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Descuento ({Math.floor(getItemCount() / 10)}% por {Math.floor(getItemCount() / 10) * 10}{" "}
                      productos)
                    </span>
                    <span className="font-semibold text-green-600">-${getDiscount().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Envío</span>
                    <span className="font-semibold">
                      {getShipping() === 0 ? "Gratis" : `$${getShipping().toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold">Total</span>
                      <span className="text-lg font-bold text-blue-600">${getTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <motion.button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                >
                  {loading ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      <span>Proceder al Pago</span>
                    </>
                  )}
                </motion.button>

                <button
                  onClick={clearCart}
                  className="w-full mt-3 text-red-600 hover:text-red-700 transition-colors"
                  disabled={loading}
                >
                  Vaciar Carrito
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
