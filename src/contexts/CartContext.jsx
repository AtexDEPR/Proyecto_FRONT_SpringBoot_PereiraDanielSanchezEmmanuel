"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()

  // Cargar carrito del localStorage cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedCart = localStorage.getItem(`cart_${user.nombreUsuario}`)
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
          setItems([])
        }
      }
    } else {
      setItems([])
    }
  }, [isAuthenticated, user])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem(`cart_${user.nombreUsuario}`, JSON.stringify(items))
    }
  }, [items, isAuthenticated, user])

  const addToCart = (product, quantity = 1, lote = null) => {
    if (!isAuthenticated) {
      console.warn("Usuario no autenticado, no se puede agregar al carrito")
      return
    }

    console.log("=== AGREGANDO AL CARRITO ===")
    console.log("Producto:", product)
    console.log("Lote:", lote)
    console.log("Cantidad:", quantity)

    setItems((prevItems) => {
      const productId = product.id_producto || product.id || product.idProducto
      const existingItem = prevItems.find(
        (item) =>
          (item.id_producto || item.id || item.idProducto) === productId && item.conservante === product.conservante,
      )

      if (existingItem) {
        return prevItems.map((item) =>
          (item.id_producto || item.id || item.idProducto) === productId && item.conservante === product.conservante
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      } else {
        const newItem = {
          ...product,
          quantity,
          id_producto: productId,
          // Si se proporciona un lote específico, usarlo
          loteId: lote?.idLote || lote?.id_lote || product.loteId,
          codigoLote: lote?.codigoLote || lote?.codigo_lote || product.codigoLote,
        }

        console.log("Nuevo item agregado:", newItem)
        return [...prevItems, newItem]
      }
    })
  }

  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => (item.id_producto || item.id || item.idProducto) !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        (item.id_producto || item.id || item.idProducto) === productId ? { ...item, quantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setItems([])
    if (isAuthenticated && user) {
      localStorage.removeItem(`cart_${user.nombreUsuario}`)
    }
  }

  const getDiscount = () => {
    const totalItems = getCartItemsCount()
    const discountGroups = Math.floor(totalItems / 10)
    const discountPercentage = discountGroups * 1
    const subtotal = items.reduce((total, item) => total + (item.precio_lista || item.precio || 0) * item.quantity, 0)
    return (subtotal * discountPercentage) / 100
  }

  const getShipping = () => {
    const subtotal = items.reduce((total, item) => total + (item.precio_lista || item.precio || 0) * item.quantity, 0)
    const discount = getDiscount()
    const subtotalWithDiscount = subtotal - discount
    return subtotalWithDiscount >= 50 ? 0 : 5.0
  }

  const getCartTotal = () => {
    const subtotal = items.reduce((total, item) => total + (item.precio_lista || item.precio || 0) * item.quantity, 0)
    const discount = getDiscount()
    const shipping = getShipping()
    return subtotal - discount + shipping
  }

  const getSubtotal = () => {
    return items.reduce((total, item) => total + (item.precio_lista || item.precio || 0) * item.quantity, 0)
  }

  const getCartItemsCount = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalItems = () => {
    return getCartItemsCount()
  }

  const value = {
    items,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    getTotalItems,
    removeItem: removeFromCart,
    getTotal: getCartTotal,
    getItemCount: getCartItemsCount,
    getDiscount,
    getShipping,
    getSubtotal,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
