"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Link } from "react-router-dom"
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
  ArrowLeft,
  Download,
  BarChart3,
  Database,
  Bell,
  Activity,
} from "lucide-react"
import { productService } from "../services/productService"
import { orderService } from "../services/orderService"
import { loteService } from "../services/loteService"
import LoadingSpinner from "../components/LoadingSpinner"

// Componente OrderStatusBadge local
const OrderStatusBadge = ({ status }) => {
  const statusConfig = {
    PENDIENTE: { color: "bg-yellow-500", text: "Pendiente", icon: Clock },
    EN_PROCESO: { color: "bg-blue-500", text: "En Proceso", icon: RefreshCw },
    ENVIADO: { color: "bg-green-500", text: "Enviado", icon: Truck },
    ENTREGADO: { color: "bg-green-600", text: "Entregado", icon: CheckCircle },
    CANCELADO: { color: "bg-red-500", text: "Cancelado", icon: XCircle },
  }

  const config = statusConfig[status] || statusConfig.PENDIENTE
  const Icon = config.icon

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white ${config.color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {config.text}
    </span>
  )
}

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
    lowStockProducts: 0,
    todayProduction: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Cargar datos en paralelo
      const [productsData, ordersData, lotesData] = await Promise.all([
        productService.getAllProducts().catch((err) => {
          console.error("Error loading products:", err)
          return []
        }),
        orderService.getAllOrders().catch((err) => {
          console.error("Error loading orders:", err)
          return []
        }),
        loteService.getAllLotes().catch((err) => {
          console.error("Error loading lotes:", err)
          return []
        }),
      ])

      setProducts(productsData)
      setOrders(ordersData)
      setLotes(lotesData)

      // Calculate stats from real data
      const pendingOrders = ordersData.filter((order) => order.estado === "PENDIENTE").length
      const lowStockProducts = productsData.filter((product) => (product.stock || 0) < 10).length
      const defectiveLotes = lotesData.filter((lote) => lote.estado === "DEFECTUOSO").length
      const totalProduction = lotesData.reduce((sum, lote) => sum + (lote.cantidadTotal || lote.cantidadProd || 0), 0)

      // Calcular producción del día (lotes creados hoy)
      const today = new Date().toDateString()
      const todayProduction = lotesData
        .filter((lote) => new Date(lote.fechaProd).toDateString() === today)
        .reduce((sum, lote) => sum + (lote.cantidadTotal || lote.cantidadProd || 0), 0)

      setStats({
        totalProducts: productsData.length,
        pendingOrders,
        totalProduction,
        defectiveLotes,
        lowStockProducts,
        todayProduction,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus)
      setOrders(
        orders.map((order) =>
          order.idPedido === orderId || order.id === orderId ? { ...order, estado: newStatus } : order,
        ),
      )
    } catch (error) {
      console.error("Error updating order status:", error)
      alert("Error al actualizar el estado del pedido")
    }
  }

  const handleUpdateProductStock = async (productId, newStock) => {
    try {
      await productService.updateProduct(productId, { stock: newStock })
      setProducts(products.map((product) => (product.id === productId ? { ...product, stock: newStock } : product)))
    } catch (error) {
      console.error("Error updating product stock:", error)
      alert("Error al actualizar el stock del producto")
    }
  }

  const exportData = (type) => {
    let data = []
    let filename = ""

    switch (type) {
      case "products":
        data = products.map((product) => [
          product.id,
          product.nombre,
          product.tipoConservante,
          product.precio,
          product.stock || 0,
          (product.stock || 0) < 10 ? "Stock Bajo" : "Disponible",
        ])
        filename = "inventario_productos.csv"
        break
      case "orders":
        data = orders.map((order) => [
          order.idPedido || order.id,
          order.numeroPedido,
          order.clienteNombre,
          order.estado,
          order.total,
          new Date(order.fechaPedido).toLocaleDateString(),
        ])
        filename = "pedidos_operador.csv"
        break
      case "lotes":
        data = lotes.map((lote) => [
          lote.id,
          lote.codigoLote,
          lote.producto?.nombre || "N/A",
          lote.cantidadTotal || lote.cantidadProd,
          lote.cantidadDisp,
          lote.estado,
          new Date(lote.fechaProd).toLocaleDateString(),
        ])
        filename = "lotes_produccion.csv"
        break
    }

    const csvContent = data.map((row) => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
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

  const StatCard = ({ icon: Icon, title, value, color, trend, subtitle, onClick, alert }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -5 }}
      onClick={onClick}
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 relative overflow-hidden group cursor-pointer ${
        alert ? "ring-2 ring-red-500 ring-opacity-50" : ""
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {alert && (
            <div className="flex items-center text-red-500">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-xs font-medium">Atención</span>
            </div>
          )}
          {trend !== undefined && !alert && (
            <div className={`flex items-center text-sm ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
              <TrendingUp className={`w-4 h-4 mr-1 ${trend < 0 ? "rotate-180" : ""}`} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>

      <motion.div
        className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${color}`}
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
    </motion.div>
  )

  const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(id)}
      className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
        isActive
          ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
      }`}
    >
      <Icon className="w-5 h-5 mr-2" />
      {label}
    </motion.button>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white shadow-sm border-b px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Inicio
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                Dashboard Operador
              </h1>
              <p className="text-gray-600 mt-1">Gestión de inventario y pedidos</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-gray-600" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadDashboardData}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8"
        >
          <StatCard
            icon={Package}
            title="Total Productos"
            value={stats.totalProducts}
            color="from-cyan-500 to-blue-500"
            trend={5}
            subtitle="En inventario"
            onClick={() => setActiveTab("products")}
          />
          <StatCard
            icon={ShoppingCart}
            title="Pedidos Pendientes"
            value={stats.pendingOrders}
            color="from-yellow-500 to-orange-500"
            trend={-2}
            subtitle="Requieren atención"
            onClick={() => setActiveTab("orders")}
            alert={stats.pendingOrders > 5}
          />
          <StatCard
            icon={TrendingUp}
            title="Producción Total"
            value={stats.totalProduction}
            color="from-green-500 to-emerald-500"
            trend={8}
            subtitle="Unidades producidas"
            onClick={() => setActiveTab("production")}
          />
          <StatCard
            icon={AlertTriangle}
            title="Stock Bajo"
            value={stats.lowStockProducts}
            color="from-red-500 to-pink-500"
            subtitle="Productos críticos"
            onClick={() => setActiveTab("products")}
            alert={stats.lowStockProducts > 0}
          />
          <StatCard
            icon={Database}
            title="Lotes Defectuosos"
            value={stats.defectiveLotes}
            color="from-purple-500 to-indigo-500"
            subtitle="Requieren revisión"
            onClick={() => setActiveTab("production")}
            alert={stats.defectiveLotes > 0}
          />
          <StatCard
            icon={Activity}
            title="Producción Hoy"
            value={stats.todayProduction}
            color="from-blue-500 to-purple-500"
            subtitle="Unidades del día"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
        >
          <TabButton
            id="overview"
            label="Resumen"
            icon={BarChart3}
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
            icon={Database}
            isActive={activeTab === "production"}
            onClick={setActiveTab}
          />
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab orders={orders} products={products} lotes={lotes} stats={stats} />}

          {activeTab === "products" && (
            <ProductsTab
              products={products}
              setProducts={setProducts}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              onUpdateStock={handleUpdateProductStock}
              onExport={() => exportData("products")}
            />
          )}

          {activeTab === "orders" && (
            <OrdersTab
              orders={orders}
              setOrders={setOrders}
              onUpdateStatus={handleUpdateOrderStatus}
              onExport={() => exportData("orders")}
            />
          )}

          {activeTab === "production" && (
            <ProductionTab lotes={lotes} setLotes={setLotes} products={products} onExport={() => exportData("lotes")} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Componente Overview Tab
const OverviewTab = ({ orders, products, lotes, stats }) => (
  <motion.div
    key="overview"
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-6"
  >
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Pedidos recientes */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Pedidos Recientes</h3>
        <div className="space-y-4">
          {orders.slice(0, 5).map((order, index) => (
            <motion.div
              key={order.idPedido || order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
            >
              <div>
                <p className="font-medium text-gray-900">Pedido #{order.numeroPedido}</p>
                <p className="text-sm text-gray-600">Cliente: {order.clienteNombre || "Cliente desconocido"}</p>
                <p className="text-xs text-gray-500">{new Date(order.fechaPedido).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">${order.total?.toFixed(2) || "0.00"}</p>
                <OrderStatusBadge status={order.estado} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Productos con stock bajo */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-900">Productos con Stock Bajo</h3>
        <div className="space-y-4">
          {products
            .filter((product) => (product.stock || 0) < 10)
            .slice(0, 5)
            .map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.nombre}</p>
                    <p className="text-sm text-gray-600">{product.tipoConservante}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-600">Stock: {product.stock || 0}</p>
                  <p className="text-sm text-gray-600">${product.precio}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>

    {/* Gráfico de producción */}
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Producción por Tipo</h3>
      <div className="space-y-4">
        {["ACEITE", "AGUA", "SALSA"].map((type, index) => {
          const count = lotes.filter((lote) => lote.producto?.tipoConservante === type).length
          const percentage = lotes.length > 0 ? (count / lotes.length) * 100 : 0
          const colors = ["from-blue-500 to-cyan-500", "from-green-500 to-emerald-500", "from-purple-500 to-pink-500"]

          return (
            <div key={type} className="flex items-center justify-between">
              <span className="text-gray-700 font-medium">Atún en {type}</span>
              <div className="flex items-center space-x-3">
                <div className="w-40 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                    className={`bg-gradient-to-r ${colors[index]} h-3 rounded-full`}
                  />
                </div>
                <span className="text-gray-900 font-semibold w-12 text-right">{count}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  </motion.div>
)

// Componente Products Tab
const ProductsTab = ({
  products,
  setProducts,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  onUpdateStock,
  onExport,
}) => {
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tipoConservante?.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (filterStatus === "low_stock") {
      matchesStatus = product.stock < 10
    } else if (filterStatus === "out_of_stock") {
      matchesStatus = product.stock === 0
    } else if (filterStatus === "available") {
      matchesStatus = product.stock > 10
    }

    return matchesSearch && matchesStatus
  })

  return (
    <motion.div
      key="products"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Productos</h3>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Producto
          </motion.button>
        </div>
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
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Tipo</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Stock</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Precio</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <Package className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{product.nombre}</p>
                      <p className="text-sm text-gray-600">{product.descripcion}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-700">{product.tipoConservante}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-medium ${
                        product.stock > 50
                          ? "text-green-600"
                          : product.stock > 10
                            ? "text-yellow-600"
                            : product.stock > 0
                              ? "text-orange-600"
                              : "text-red-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                    <input
                      type="number"
                      min="0"
                      defaultValue={product.stock}
                      onBlur={(e) => {
                        const newStock = Number.parseInt(e.target.value)
                        if (newStock !== product.stock) {
                          onUpdateStock(product.id, newStock)
                        }
                      }}
                      className="w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500"
                    />
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-900 font-medium">${product.precio}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
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
                      className="p-2 text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-300"
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
  )
}

// Componente Orders Tab
const OrdersTab = ({ orders, setOrders, onUpdateStatus, onExport }) => {
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.clienteNombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.numeroPedido?.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesStatus = true
    if (filterStatus !== "all") {
      matchesStatus = order.estado === filterStatus
    }

    return matchesSearch && matchesStatus
  })

  return (
    <motion.div
      key="orders"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Pedidos</h3>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </motion.button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar pedidos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          <option value="all">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="EN_PROCESO">En Proceso</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Pedido</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Cliente</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Fecha</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Total</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <motion.tr
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-4 px-4">
                  <p className="font-medium text-gray-900">#{order.numeroPedido || order.id}</p>
                </td>
                <td className="py-4 px-4 text-gray-700">{order.clienteNombre || "Cliente Desconocido"}</td>
                <td className="py-4 px-4 text-gray-700">{new Date(order.fechaPedido).toLocaleDateString()}</td>
                <td className="py-4 px-4 text-gray-900 font-medium">${order.total?.toFixed(2) || "0.00"}</td>
                <td className="py-4 px-4">
                  <OrderStatusBadge status={order.estado} />
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-cyan-600 hover:bg-cyan-100 rounded-lg transition-colors duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </motion.button>
                    {order.estado === "PENDIENTE" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onUpdateStatus(order.id, "EN_PROCESO")}
                        className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors duration-300"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </motion.button>
                    )}
                    {order.estado === "EN_PROCESO" && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onUpdateStatus(order.id, "ENVIADO")}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-300"
                      >
                        <Truck className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// Componente Production Tab
const ProductionTab = ({ lotes, setLotes, products, onExport }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredLotes = lotes.filter((lote) => {
    const matchesSearch =
      lote.codigoLote?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lote.producto?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  return (
    <motion.div
      key="production"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Gestión de Producción</h3>
        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onExport}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Lote
          </motion.button>
        </div>
      </div>

      {/* Search */}
      <div className="relative flex-1 mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar lotes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        />
      </div>

      {/* Production Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Lote</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Producto</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Cantidad Producida</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Cantidad Disponible</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Estado</th>
              <th className="text-left py-3 px-4 text-gray-600 font-medium">Fecha Producción</th>
            </tr>
          </thead>
          <tbody>
            {filteredLotes.map((lote, index) => (
              <motion.tr
                key={lote.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <td className="py-4 px-4">
                  <p className="font-medium text-gray-900">{lote.codigoLote}</p>
                </td>
                <td className="py-4 px-4 text-gray-700">{lote.producto?.nombre || "N/A"}</td>
                <td className="py-4 px-4 text-gray-700">{lote.cantidadProd}</td>
                <td className="py-4 px-4 text-gray-700">{lote.cantidadDisp}</td>
                <td className="py-4 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      lote.estado === "DISPONIBLE"
                        ? "bg-green-100 text-green-800"
                        : lote.estado === "DEFECTUOSO"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {lote.estado}
                  </span>
                </td>
                <td className="py-4 px-4 text-gray-700">{new Date(lote.fechaProd).toLocaleDateString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

export default OperatorDashboard
