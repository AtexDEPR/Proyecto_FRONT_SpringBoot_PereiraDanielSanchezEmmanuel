import api from "./api";

export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await api.get("/productos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  // Obtener producto por ID
  getProductById: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener producto:", error);
      throw error;
    }
  },

  // Crear nuevo producto
  createProduct: async (productData) => {
    try {
      const response = await api.post("/productos", productData);
      return response.data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  },

  // Actualizar producto
  updateProduct: async (id, productData) => {
    try {
      const response = await api.put(`/productos/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  },

  // Eliminar producto
  deleteProduct: async (id) => {
    try {
      const response = await api.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  },

  // Buscar productos
  searchProducts: async (searchTerm) => {
    try {
      const response = await api.get(
        `/productos/buscar?q=${encodeURIComponent(searchTerm)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al buscar productos:", error);
      throw error;
    }
  },
};
