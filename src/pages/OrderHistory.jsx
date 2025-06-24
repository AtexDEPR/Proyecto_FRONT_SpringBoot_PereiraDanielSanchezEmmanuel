"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Calendar,
  DollarSign,
  Truck,
  Search,
  Filter,
  Download,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  CreditCard,
} from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { orderService } from "../services/orderService"
import { useOrderStatusUpdater } from "../hooks/useOrderStatusUpdater"
import LoadingSpinner from "../components/LoadingSpinner"

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

const OrderHistory = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date_desc")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Estadísticas del usuario
  const [userStats, setUserStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    averageOrderValue: 0,
    favoriteProduct: null,
  })

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    calculateUserStats()
  }, [orders])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await orderService.getByUser()

      // Normalizar datos según la estructura del backend
      let ordersData = []
      if (response && response.success && Array.isArray(response.data)) {
        ordersData = response.data
      } else if (Array.isArray(response)) {
        ordersData = response
      } else {
        console.warn("Estructura de respuesta inesperada:", response)
        ordersData = []
      }

      // Debug: mostrar estructura de un pedido para verificar detalles
      if (ordersData.length > 0) {
        console.log("Estructura del primer pedido:", ordersData[0])
        console.log("Detalles del primer pedido:", ordersData[0].detalles || ordersData[0].detallePedidos)
      }

      setOrders(ordersData)
    } catch (err) {
      console.error("Error completo:", err)
      setError("Error al cargar el historial de pedidos")
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const calculateUserStats = () => {
    if (!orders.length) return

    const totalOrders = orders.length
    const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0)
    const averageOrderValue = totalSpent / totalOrders

    // Encontrar producto favorito
    const productCounts = {}
    orders.forEach((order) => {
      const detalles = order.detalles || []
      detalles.forEach((detalle) => {
        const productName = detalle.nombreProducto || "Producto desconocido"
        productCounts[productName] = (productCounts[productName] || 0) + (detalle.cantidad || 0)
      })
    })

    const favoriteProduct = Object.keys(productCounts).reduce(
      (a, b) => (productCounts[a] > productCounts[b] ? a : b),
      null,
    )

    setUserStats({
      totalOrders,
      totalSpent,
      averageOrderValue,
      favoriteProduct,
    })
  }

  // Filtros aplicados
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.numeroPedido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.idPedido?.toString().includes(searchTerm),
      )
    }

    // Filtro por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.estado === statusFilter)
    }

    // Filtro por fecha
    if (dateFilter !== "all") {
      const now = new Date()
      const filterDate = new Date()

      switch (dateFilter) {
        case "week":
          filterDate.setDate(now.getDate() - 7)
          break
        case "month":
          filterDate.setMonth(now.getMonth() - 1)
          break
        case "quarter":
          filterDate.setMonth(now.getMonth() - 3)
          break
      }

      filtered = filtered.filter((order) => new Date(order.fechaPedido) >= filterDate)
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date_desc":
          return new Date(b.fechaPedido) - new Date(a.fechaPedido)
        case "date_asc":
          return new Date(a.fechaPedido) - new Date(b.fechaPedido)
        case "amount_desc":
          return (b.total || 0) - (a.total || 0)
        case "amount_asc":
          return (a.total || 0) - (b.total || 0)
        case "status":
          return a.estado.localeCompare(b.estado)
        default:
          return 0
      }
    })

    return filtered
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy])

  // Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage)
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleStatusChange = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.idPedido === orderId ? { ...order, estado: newStatus } : order)),
    )
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Número Pedido", "Fecha", "Estado", "Total", "Productos"],
      ...filteredOrders.map((order) => [
        order.numeroPedido || order.idPedido,
        new Date(order.fechaPedido).toLocaleDateString(),
        order.estado,
        order.total?.toFixed(2),
        order.detalles?.length || 0,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "historial_pedidos.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "PENDIENTE":
        return <Clock className="w-5 h-5 text-yellow-500" />
      case "EN_PROCESO":
        return <Package className="w-5 h-5 text-blue-500" />
      case "ENVIADO":
        return <Truck className="w-5 h-5 text-purple-500" />
      case "ENTREGADO":
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
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "EN_PROCESO":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "ENVIADO":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "ENTREGADO":
        return "bg-green-100 text-green-800 border-green-200"
      case "CANCELADO":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusText = (status) => {
    const statusMap = {
      PENDIENTE: "Pendiente",
      EN_PROCESO: "En Proceso",
      ENVIADO: "Enviado",
      ENTREGADO: "Entregado",
      CANCELADO: "Cancelado",
    }
    return statusMap[status] || status
  }

  if (loading) return <LoadingSpinner />
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header con estadísticas */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Historial de Pedidos</h1>
                <p className="text-gray-600">Gestiona y revisa todos tus pedidos</p>
              </div>
              <div className="flex items-center space-x-3">
                <motion.button
                  onClick={exportToCSV}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Exportar
                </motion.button>
                <motion.button
                  onClick={fetchOrders}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Actualizar
                </motion.button>
              </div>
            </div>

            {/* Estadísticas del usuario */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Pedidos</p>
                    <p className="text-2xl font-bold">{userStats.totalOrders}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Gastado</p>
                    <p className="text-2xl font-bold">${userStats.totalSpent.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Promedio por Pedido</p>
                    <p className="text-2xl font-bold">${userStats.averageOrderValue.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-200" />
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Producto Favorito</p>
                    <p className="text-lg font-bold truncate">{userStats.favoriteProduct || "N/A"}</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-orange-200" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filtros y búsqueda */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filtro por estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="EN_PROCESO">En Proceso</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>

            {/* Filtro por fecha */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las fechas</option>
              <option value="week">Última semana</option>
              <option value="month">Último mes</option>
              <option value="quarter">Últimos 3 meses</option>
            </select>

            {/* Ordenamiento */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date_desc">Más reciente</option>
              <option value="date_asc">Más antiguo</option>
              <option value="amount_desc">Mayor monto</option>
              <option value="amount_asc">Menor monto</option>
              <option value="status">Por estado</option>
            </select>

            {/* Limpiar filtros */}
            <motion.button
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setDateFilter("all")
                setSortBy("date_desc")
                setCurrentPage(1)
              }}
              className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpiar
            </motion.button>
          </div>
        </motion.div>

        {/* Lista de pedidos */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12 bg-white rounded-2xl shadow-lg"
          >
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {orders.length === 0 ? "No tienes pedidos aún" : "No se encontraron pedidos"}
            </h2>
            <p className="text-gray-600 mb-6">
              {orders.length === 0
                ? "Realiza tu primer pedido para ver tu historial aquí"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            {orders.length === 0 && (
              <motion.button
                onClick={() => (window.location.href = "/")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explorar Productos
              </motion.button>
            )}
          </motion.div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedOrders.map((order, index) => (
                <OrderCard
                  key={order.idPedido}
                  order={order}
                  index={index}
                  selectedOrder={selectedOrder}
                  setSelectedOrder={setSelectedOrder}
                  getStatusIcon={getStatusIcon}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-white rounded-2xl shadow-lg p-6 mt-6"
              >
                <div className="text-sm text-gray-700">
                  Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                  {Math.min(currentPage * itemsPerPage, filteredOrders.length)} de {filteredOrders.length} pedidos
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === 1 ? 1 : 0.95 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                  </motion.button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <motion.button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-2 rounded-lg ${
                          currentPage === page ? "bg-blue-600 text-white" : "border border-gray-300 hover:bg-gray-50"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {page}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                    whileTap={{ scale: currentPage === totalPages ? 1 : 0.95 }}
                  >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Componente OrderCard mejorado
const OrderCard = ({
  order,
  index,
  selectedOrder,
  setSelectedOrder,
  getStatusIcon,
  getStatusColor,
  getStatusText,
  onStatusChange,
}) => {
  useOrderStatusUpdater(order.idPedido, order.estado, (newStatus) => onStatusChange(order.idPedido, newStatus))

  const getProgressPercentage = (status) => {
    const statusOrder = ["PENDIENTE", "EN_PROCESO", "ENVIADO", "ENTREGADO"]
    const currentIndex = statusOrder.indexOf(status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="p-6">
        {/* Header del pedido */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(order.estado)}
              <div>
                <h3 className="font-bold text-lg text-gray-900">Pedido #{order.numeroPedido || order.idPedido}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(order.fechaPedido).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(order.estado)}`}>
                {getStatusText(order.estado)}
              </span>
              {(order.estado === "PENDIENTE" || order.estado === "EN_PROCESO" || order.estado === "ENVIADO") && (
                <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                  <span>Actualizando automáticamente</span>
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">${order.total?.toFixed(2)}</p>
            <motion.button
              onClick={() => setSelectedOrder(selectedOrder === order.idPedido ? null : order.idPedido)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors mt-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              <span>{selectedOrder === order.idPedido ? "Ocultar" : "Ver"} Detalles</span>
            </motion.button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>Progreso del pedido</span>
            <span>{getProgressPercentage(order.estado).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${getProgressPercentage(order.estado)}%` }}
              transition={{ duration: 1, delay: index * 0.1 }}
            />
          </div>
        </div>

        {/* Información básica */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Fecha de Pedido</p>
              <p className="text-sm font-medium">{new Date(order.fechaPedido).toLocaleDateString("es-ES")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Package className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Productos</p>
              <p className="text-sm font-medium">{order.detalles?.length || 0} items</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <Truck className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Entrega Programada</p>
              <p className="text-sm font-medium">
                {order.fechaEntrega ? new Date(order.fechaEntrega).toLocaleDateString("es-ES") : "Por definir"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-gray-600">
            <CreditCard className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Método de Pago</p>
              <p className="text-sm font-medium">{order.metodoPago || "Efectivo"}</p>
            </div>
          </div>
        </div>

        {/* Detalles expandibles */}
        <AnimatePresence>
          {selectedOrder === order.idPedido && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-6 mt-6"
            >
              {/* Productos del pedido */}
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-4 flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Productos del Pedido
                </h4>
                <div className="space-y-3">
                  {(order.detalles || []).map((detalle, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between bg-gray-50 p-4 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden">
                          <img
                            src={getProductImage(detalle.conservanteProducto) || "/placeholder.svg"} // ✅ CAMPO CORRECTO
                            alt={detalle.nombreProducto || "Producto"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.parentElement.innerHTML =
                                '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></div>'
                            }}
                          />
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-900">{detalle.nombreProducto || "Producto"}</h5>
                          <p className="text-sm text-gray-600">{detalle.descripcionProducto || "Sin descripción"}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Cantidad: {detalle.cantidad || 0}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Lote: {detalle.codigoLote || "N/A"}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                              Tipo: {detalle.conservanteProducto || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ${((detalle.precioUnitario || 0) * (detalle.cantidad || 0))?.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">${(detalle.precioUnitario || 0)?.toFixed(2)} c/u</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Información de entrega */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {order.fechaEntrega && (
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <h5 className="font-semibold text-blue-900">Fecha de Entrega Programada</h5>
                    </div>
                    <p className="text-blue-800">
                      {new Date(order.fechaEntrega).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}

                {order.fechaEntregaReal && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h5 className="font-semibold text-green-900">Fecha de Entrega Real</h5>
                    </div>
                    <p className="text-green-800">
                      {new Date(order.fechaEntregaReal).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Resumen de costos */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h5 className="font-semibold text-lg mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Resumen de Costos
                </h5>
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-medium">${order.subtotal?.toFixed(2) || order.total?.toFixed(2)}</span>
                  </div>
                  {order.descuento > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Descuento:</span>
                      <span className="font-medium">-${order.descuento?.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total:</span>
                      <span>${order.total?.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export default OrderHistory
