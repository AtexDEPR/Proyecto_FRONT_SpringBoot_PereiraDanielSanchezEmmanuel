"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Eye,
  Edit,
  Plus,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from "lucide-react"
import { productService } from "../services/productService"
import { orderService } from "../services/orderService"
import LoadingSpinner from "../components/LoadingSpinner"

const OperatorDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [lotes, setLotes] = useState([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingOrders: 0,
    totalProduction: 0,
    defectiveLotes: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [productsData, ordersData] = await Promise.all([
        productService.getAllProducts(),
        orderService.getAllOrders(),
      ])

      setProducts(productsData)
      setOrders(ordersData)

      // Calculate stats
      setStats({
        totalProducts: productsData.length,
        pendingOrders: ordersData.filter((order) => order.estado === "PENDIENTE").length,
        totalProduction: productsData.reduce((sum, product) => sum + product.stock, 0),
        defectiveLotes: 0, // This would come from lotes API
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  const glowVariants = {
    initial: { boxShadow: "0 0 0 rgba(0, 255, 255, 0)" },
    hover: {
      boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)",
      transition: { duration: 0.3 },
    },
  }

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      initial="initial"
      className={`bg-gray-900 border border-gray-800 rounded-xl p-6 relative overflow-hidden group cursor-pointer`}
    >
      <motion.div
        variants={glowVariants}
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.div>
  )

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/25"
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </motion.button>
  )

  const OrderStatusBadge = ({ status }) => {
    const statusConfig = {
      PENDIENTE: { color: "bg-yellow-500", text: "Pendiente", icon: Clock },
      EN_PROCESO: { color: "bg-blue-500", text: "En Proceso", icon: RefreshCw },
      ENVIADO: { color: "bg-green-500", text: "Enviado", icon: Truck },
      CANCELADO: { color: "bg-red-500", text: "Cancelado", icon: XCircle },
    }

    const config = statusConfig[status] || statusConfig.PENDIENTE
    const Icon = config.icon

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gray-900 border-b border-gray-800 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Dashboard Operador
            </h1>
            <p className="text-gray-400 mt-1">Gestión de inventario y pedidos</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadDashboardData}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </motion.button>
        </div>
      </motion.div>

      <div className="p-6">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Package}
            title="Total Productos"
            value={stats.totalProducts}
            color="from-cyan-500 to-blue-500"
            trend={5}
          />
          <StatCard
            icon={ShoppingCart}
            title="Pedidos Pendientes"
            value={stats.pendingOrders}
            color="from-yellow-500 to-orange-500"
            trend={-2}
          />
          <StatCard
            icon={TrendingUp}
            title="Producción Total"
            value={stats.totalProduction}
            color="from-green-500 to-emerald-500"
            trend={8}
          />
          <StatCard
            icon={AlertTriangle}
            title="Lotes Defectuosos"
            value={stats.defectiveLotes}
            color="from-red-500 to-pink-500"
            trend={0}
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-8 bg-gray-900 p-4 rounded-xl border border-gray-800"
        >
          <TabButton
            id="overview"
            label="Resumen"
            icon={TrendingUp}
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
          />
          <TabButton
            id="products"
            label="Productos"
            icon={Package}
            isActive={activeTab === "products"}
            onClick={setActiveTab}
          />
          <TabButton
            id="orders"
            label="Pedidos"
            icon={ShoppingCart}
            isActive={activeTab === "orders"}
            onClick={setActiveTab}
          />
          <TabButton
            id="production"
            label="Producción"
            icon={TrendingUp}
            isActive={activeTab === "production"}
            onClick={setActiveTab}
          />
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Recent Orders */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Pedidos Recientes</h3>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order, index) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-300"
                    >
                      <div>
                        <p className="font-medium">Pedido #{order.id}</p>
                        <p className="text-sm text-gray-400">Cliente: {order.clienteNombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${order.total}</p>
                        <OrderStatusBadge status={order.estado} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "products" && (
            <motion.div
              key="products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Gestión de Productos</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </motion.button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                >
                  <option value="all">Todos los estados</option>
                  <option value="available">Disponible</option>
                  <option value="low_stock">Stock bajo</option>
                  <option value="out_of_stock">Sin stock</option>
                </select>
              </div>

              {/* Products Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Producto</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Tipo</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Stock</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Precio</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Estado</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product, index) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-300"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                              <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{product.nombre}</p>
                              <p className="text-sm text-gray-400">{product.descripcion}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{product.tipoConservante}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`font-medium ${
                              product.stock > 50
                                ? "text-green-400"
                                : product.stock > 10
                                  ? "text-yellow-400"
                                  : "text-red-400"
                            }`}
                          >
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-white font-medium">${product.precio}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.stock > 10
                                ? "bg-green-500/20 text-green-400"
                                : product.stock > 0
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {product.stock > 10 ? "Disponible" : product.stock > 0 ? "Stock Bajo" : "Sin Stock"}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded-lg transition-colors duration-300"
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors duration-300"
                            >
                              <Edit className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "orders" && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-6 text-cyan-400">Gestión de Pedidos</h3>

              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">Pedido #{order.id}</h4>
                        <p className="text-gray-400">Cliente: {order.clienteNombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-white">${order.total}</p>
                        <OrderStatusBadge status={order.estado} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Fecha de Pedido</p>
                        <p className="text-white">{new Date(order.fechaPedido).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Fecha de Entrega</p>
                        <p className="text-white">{new Date(order.fechaEntrega).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Productos</p>
                        <p className="text-white">{order.detalles?.length || 0} items</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors duration-300"
                      >
                        Ver Detalles
                      </motion.button>
                      {order.estado === "PENDIENTE" && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors duration-300"
                        >
                          Procesar
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "production" && (
            <motion.div
              key="production"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Gestión de Producción</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Lote
                </motion.button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production Chart Placeholder */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Producción por Tipo</h4>
                  <div className="space-y-4">
                    {["Atún en Aceite", "Atún en Agua", "Atún en Salsa"].map((type, index) => (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-gray-300">{type}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.random() * 100}%` }}
                              transition={{ duration: 1, delay: index * 0.2 }}
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                            />
                          </div>
                          <span className="text-white font-medium">{Math.floor(Math.random() * 1000)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Lotes */}
                <div className="bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Lotes Recientes</h4>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((lote, index) => (
                      <motion.div
                        key={lote}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">Lote #L{String(lote).padStart(3, "0")}</p>
                          <p className="text-sm text-gray-400">Atún en Aceite</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white">500 unidades</p>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Disponible
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default OperatorDashboard
