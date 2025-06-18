"use client"

import { Routes, Route } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useLocation } from "react-router-dom"

// Pages
import Home from "./pages/Home"
import ProductDetail from "./pages/ProductDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Cart from "./pages/Cart"
import OrderHistory from "./pages/OrderHistory"
import OperatorDashboard from "./pages/OperatorDashboard"
import AdminDashboard from "./pages/AdminDashboard"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"
import ErrorBoundary from "./components/ErrorBoundary"

function App() {
  const location = useLocation()

  const isDashboard = location.pathname.includes("dashboard")

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {!isDashboard && <Navbar />}

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={!isDashboard ? "pt-16" : ""}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/cart"
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/operator/dashboard"
                element={
                  <ProtectedRoute requiredRole="OPERADOR">
                    <OperatorDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="ADMINISTRADOR">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </motion.main>
        </AnimatePresence>

        {!isDashboard && <Footer />}
      </div>
    </ErrorBoundary>
  )
}

export default App
