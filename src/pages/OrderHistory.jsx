"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Package, Clock, CheckCircle, XCircle, Eye, Calendar, DollarSign } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { orderService } from "../services/orderService"
import LoadingSpinner from "../components/LoadingSpinner"

const OrderHistory = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await orderService.getByClient(user.id)
      setOrders(data)
    } catch (err) {
      setError("Error al cargar el historial de pedidos")
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDIENTE":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "EN_PROCESO":
        return <Package className="w-5 h-5 text-blue-500" />
      case "ENVIADO":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "CANCELADO":
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800"
      case "EN_PROCESO":
        return "bg-blue-100 text-blue-800"
      case "ENVIADO":
        return "bg-green-100 text-green-800"
      case "CANCELADO":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Pedidos</h1>
          <p className="text-gray-600">Revisa el estado de tus pedidos anteriores</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-600 mb-6">Realiza tu primer pedido para ver tu historial aquí</p>
            <motion.button
              onClick={() => (window.location.href = "/")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explorar Productos
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.estado)}
                        <span className="font-semibold text-gray-900">Pedido #{order.id}</span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.estado)}`}>
                        {order.estado.replace("_", " ")}
                      </span>
                    </div>

                    <motion.button
                      onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Ver Detalles</span>
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{new Date(order.fechaPedido).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Package className="w-4 h-4" />
                      <span className="text-sm">{order.detalles?.length || 0} productos</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm font-semibold">${order.total?.toFixed(2)}</span>
                    </div>
                  </div>

                  {selectedOrder === order.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t pt-4 mt-4"
                    >
                      <h4 className="font-semibold mb-3">Productos del Pedido:</h4>
                      <div className="space-y-3">
                        {order.detalles?.map((detalle, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden">
                                <img
                                  src="/api/placeholder/48/48"
                                  alt={detalle.producto?.nombre}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="font-medium text-gray-900">{detalle.producto?.nombre}</h5>
                                <p className="text-sm text-gray-600">Cantidad: {detalle.cantidad}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">${detalle.precio?.toFixed(2)}</p>
                              <p className="text-sm text-gray-600">c/u</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {order.fechaEntrega && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <strong>Fecha de Entrega:</strong> {new Date(order.fechaEntrega).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderHistory
