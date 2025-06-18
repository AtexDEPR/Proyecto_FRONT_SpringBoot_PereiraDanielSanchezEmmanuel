"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Download,
  RefreshCw,
  UserPlus,
  Settings,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Database,
  Bell,
  Calendar,
  MapPin,
  Package,
} from "lucide-react"
import { orderService } from "../services/orderService"
import { productService } from "../services/productService"
import LoadingSpinner from "../components/LoadingSpinner"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [clients, setClients] = useState([])
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalClients: 0,
    totalOrders: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState("all")

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersData, productsData] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
      ])

      setOrders(ordersData)
      setProducts(productsData)

      // Mock data for users and clients
      setUsers([
        {
          id: 1,
          nombre: "Juan Pérez",
          email: "juan@example.com",
          rol: "ADMIN",
          estado: "ACTIVO",
          fechaCreacion: "2024-01-15",
        },
        {
          id: 2,
          nombre: "María García",
          email: "maria@example.com",
          rol: "OPERADOR",
          estado: "ACTIVO",
          fechaCreacion: "2024-02-20",
        },
        {
          id: 3,
          nombre: "Carlos López",
          email: "carlos@example.com",
          rol: "CLIENTE",
          estado: "INACTIVO",
          fechaCreacion: "2024-03-10",
        },
      ])

      setClients([
        {
          id: 1,
          nombre: "Empresa ABC",
          ruc: "12345678901",
          email: "contacto@abc.com",
          telefono: "123456789",
          estado: "ACTIVO",
        },
        {
          id: 2,
          nombre: "Distribuidora XYZ",
          ruc: "98765432109",
          email: "ventas@xyz.com",
          telefono: "987654321",
          estado: "ACTIVO",
        },
      ])

      // Calculate stats
      const totalRevenue = ordersData.reduce((sum, order) => sum + (order.total || 0), 0)
      setStats({
        totalUsers: 3,
        totalClients: 2,
        totalOrders: ordersData.length,
        totalRevenue,
        monthlyGrowth: 15.5,
        activeUsers: 2,
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

  const neonGlowVariants = {
    initial: {
      boxShadow: "0 0 0 rgba(255, 0, 255, 0)",
      borderColor: "rgba(255, 0, 255, 0.3)",
    },
    hover: {
      boxShadow: "0 0 30px rgba(255, 0, 255, 0.6), inset 0 0 20px rgba(255, 0, 255, 0.1)",
      borderColor: "rgba(255, 0, 255, 0.8)",
      transition: { duration: 0.3 },
    },
  }

  const StatCard = ({ icon: Icon, title, value, color, trend, subtitle }) => (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      initial="initial"
      className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6 relative overflow-hidden group cursor-pointer"
    >
      <motion.div
        variants={neonGlowVariants}
        className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`}
      />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 bg-gradient-to-r ${color} rounded-full opacity-20`}
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.5,
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-lg bg-gradient-to-r ${color} shadow-lg`}
          >
            <Icon className="w-6 h-6 text-white" />
          </motion.div>
          {trend && (
            <div className={`flex items-center text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}>
              <TrendingUp className="w-4 h-4 mr-1" />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
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
      className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 relative overflow-hidden ${
        isActive
          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25"
          : "text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700 hover:border-purple-500/50"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg"
          initial={false}
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <div className="relative z-10 flex items-center">
        <Icon className="w-5 h-5 mr-2" />
        {label}
      </div>
    </motion.button>
  )

  const UserRoleBadge = ({ role }) => {
    const roleConfig = {
      ADMIN: { color: "from-red-500 to-pink-500", text: "Administrador" },
      OPERADOR: { color: "from-blue-500 to-cyan-500", text: "Operador" },
      CLIENTE: { color: "from-green-500 to-emerald-500", text: "Cliente" },
    }

    const config = roleConfig[role] || roleConfig.CLIENTE

    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${config.color}`}
      >
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
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-gray-900 border-b-2 border-gray-800 px-6 py-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Dashboard Administrador
            </h1>
            <p className="text-gray-400 mt-1">Control total del sistema</p>
          </div>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-gray-800 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all duration-300"
            >
              <Bell className="w-5 h-5 text-gray-400" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadDashboardData}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualizar
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="relative p-6">
        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            icon={Users}
            title="Total Usuarios"
            value={stats.totalUsers}
            color="from-purple-500 to-pink-500"
            trend={12}
            subtitle="Activos este mes"
          />
          <StatCard
            icon={ShoppingCart}
            title="Total Pedidos"
            value={stats.totalOrders}
            color="from-cyan-500 to-blue-500"
            trend={8}
            subtitle="Completados"
          />
          <StatCard
            icon={DollarSign}
            title="Ingresos Totales"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            color="from-green-500 to-emerald-500"
            trend={stats.monthlyGrowth}
            subtitle="Este mes"
          />
          <StatCard
            icon={Activity}
            title="Usuarios Activos"
            value={stats.activeUsers}
            color="from-orange-500 to-red-500"
            trend={5}
            subtitle="Últimas 24h"
          />
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-8 bg-gray-900 p-4 rounded-xl border-2 border-gray-800"
        >
          <TabButton
            id="overview"
            label="Resumen"
            icon={BarChart3}
            isActive={activeTab === "overview"}
            onClick={setActiveTab}
          />
          <TabButton id="users" label="Usuarios" icon={Users} isActive={activeTab === "users"} onClick={setActiveTab} />
          <TabButton
            id="clients"
            label="Clientes"
            icon={Shield}
            isActive={activeTab === "clients"}
            onClick={setActiveTab}
          />
          <TabButton
            id="reports"
            label="Reportes"
            icon={PieChart}
            isActive={activeTab === "reports"}
            onClick={setActiveTab}
          />
          <TabButton
            id="settings"
            label="Configuración"
            icon={Settings}
            isActive={activeTab === "settings"}
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
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Revenue Chart */}
              <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-purple-400">Ingresos Mensuales</h3>
                <div className="space-y-4">
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"].map((month, index) => (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-gray-300">{month}</span>
                      <div className="flex items-center space-x-3">
                        <div className="w-40 bg-gray-800 rounded-full h-3 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.random() * 100}%` }}
                            transition={{ duration: 1.5, delay: index * 0.2 }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-lg shadow-purple-500/50"
                          />
                        </div>
                        <span className="text-white font-medium w-16 text-right">
                          ${Math.floor(Math.random() * 50000).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-cyan-400">Productos Más Vendidos</h3>
                <div className="space-y-4">
                  {products.slice(0, 5).map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <span className="text-white font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{product.nombre}</p>
                          <p className="text-sm text-gray-400">{product.tipoConservante}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-white">{Math.floor(Math.random() * 500)} vendidos</p>
                        <p className="text-sm text-gray-400">${product.precio}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Actividad Reciente</h3>
                <div className="space-y-4">
                  {[
                    { action: "Nuevo pedido creado", user: "Cliente ABC", time: "5 min ago", type: "order" },
                    { action: "Usuario registrado", user: "María González", time: "15 min ago", type: "user" },
                    { action: "Producto actualizado", user: "Operador Juan", time: "30 min ago", type: "product" },
                    { action: "Pedido completado", user: "Distribuidora XYZ", time: "1 hora ago", type: "order" },
                    { action: "Nuevo lote registrado", user: "Operador Ana", time: "2 horas ago", type: "production" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-750 transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-3 h-3 rounded-full mr-4 ${
                            activity.type === "order"
                              ? "bg-green-500"
                              : activity.type === "user"
                                ? "bg-blue-500"
                                : activity.type === "product"
                                  ? "bg-yellow-500"
                                  : "bg-purple-500"
                          }`}
                        />
                        <div>
                          <p className="text-white">{activity.action}</p>
                          <p className="text-sm text-gray-400">{activity.user}</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-purple-400">Gestión de Usuarios</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Nuevo Usuario
                </motion.button>
              </div>

              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                >
                  <option value="all">Todos los roles</option>
                  <option value="ADMIN">Administrador</option>
                  <option value="OPERADOR">Operador</option>
                  <option value="CLIENTE">Cliente</option>
                </select>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-800">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Usuario</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Rol</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Estado</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Fecha Registro</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors duration-300"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white font-bold">{user.nombre.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.nombre}</p>
                              <p className="text-sm text-gray-400">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{user.email}</td>
                        <td className="py-4 px-4">
                          <UserRoleBadge role={user.rol} />
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              user.estado === "ACTIVO" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {user.estado}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{new Date(user.fechaCreacion).toLocaleDateString()}</td>
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
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
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

          {activeTab === "clients" && (
            <motion.div
              key="clients"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-cyan-400">Gestión de Clientes</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Cliente
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {clients.map((client, index) => (
                  <motion.div
                    key={client.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-cyan-500/50 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-white font-bold text-lg">{client.nombre.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{client.nombre}</h4>
                          <p className="text-sm text-gray-400">RUC: {client.ruc}</p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          client.estado === "ACTIVO" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {client.estado}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-300">
                        <span className="w-16 text-gray-400">Email:</span>
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center text-gray-300">
                        <span className="w-16 text-gray-400">Teléfono:</span>
                        <span>{client.telefono}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end mt-4 space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors duration-300 text-sm"
                      >
                        Ver Historial
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors duration-300 text-sm"
                      >
                        Editar
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === "reports" && (
            <motion.div
              key="reports"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-pink-400">Reportes y Análisis</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { title: "Ventas por Producto", icon: BarChart3, color: "from-blue-500 to-cyan-500" },
                    { title: "Ventas por Cliente", icon: Users, color: "from-green-500 to-emerald-500" },
                    { title: "Producción y Lotes", icon: Database, color: "from-purple-500 to-pink-500" },
                    { title: "Inventario Disponible", icon: Package, color: "from-orange-500 to-red-500" },
                    { title: "Análisis Temporal", icon: Calendar, color: "from-yellow-500 to-orange-500" },
                    { title: "Distribución Geográfica", icon: MapPin, color: "from-indigo-500 to-purple-500" },
                  ].map((report, index) => (
                    <motion.div
                      key={report.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-gray-800 border border-gray-700 rounded-lg p-6 cursor-pointer hover:border-purple-500/50 transition-all duration-300"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${report.color} rounded-lg flex items-center justify-center mb-4`}
                      >
                        <report.icon className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-white mb-2">{report.title}</h4>
                      <p className="text-gray-400 text-sm mb-4">Generar reporte detallado</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Generar
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-orange-400">Configuración del Sistema</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* General Settings */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white mb-4">Configuración General</h4>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Notificaciones Email</p>
                          <p className="text-sm text-gray-400">Recibir notificaciones por correo</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-green-500 to-emerald-500 transition-colors focus:outline-none"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Modo Mantenimiento</p>
                          <p className="text-sm text-gray-400">Activar modo mantenimiento</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-1" />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Backup Automático</p>
                          <p className="text-sm text-gray-400">Realizar backups diarios</p>
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className="relative inline-flex h-6 w-11 items-center rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-colors focus:outline-none"
                        >
                          <span className="inline-block h-4 w-4 transform rounded-full bg-white transition translate-x-6" />
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-white mb-4">Configuración de Seguridad</h4>

                    <div className="space-y-3">
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-white font-medium mb-2">Tiempo de Sesión (minutos)</p>
                        <input
                          type="number"
                          defaultValue="30"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        />
                      </div>

                      <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-white font-medium mb-2">Intentos de Login Máximos</p>
                        <input
                          type="number"
                          defaultValue="5"
                          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                        />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 rounded-lg hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300"
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Actualizar Configuración
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-gray-900 border-2 border-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-6 text-cyan-400">Información del Sistema</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Versión del Sistema</p>
                    <p className="text-white font-semibold text-lg">v2.1.0</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Último Backup</p>
                    <p className="text-white font-semibold text-lg">Hoy 03:00</p>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Uptime</p>
                    <p className="text-white font-semibold text-lg">15 días</p>
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

export default AdminDashboard
