import api from "./api";

export const productService = {
  getAll: async () => {
    try {
      console.log("Solicitando productos...");
      const response = await api.get("/productos");
      console.log("Respuesta de productos:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en productService.getAll:", error);
      console.error("Error response data:", error.response?.data);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      console.log(`Solicitando producto con ID: ${id}`);
      const response = await api.get(`/productos/${id}`);
      console.log("Respuesta de producto:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error en productService.getById(${id}):`, error);
      throw error;
    }
  },

  create: async (productData) => {
    try {
      console.log("Creando producto:", productData);
      const response = await api.post("/productos", productData);
      console.log("Producto creado:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error en productService.create:", error);
      throw error;
    }
  },

  update: async (id, productData) => {
    try {
      console.log(`Actualizando producto ${id}:`, productData);
      const response = await api.put(`/productos/${id}`, productData);
      console.log("Producto actualizado:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error en productService.update(${id}):`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      console.log(`Eliminando producto con ID: ${id}`);
      const response = await api.delete(`/productos/${id}`);
      console.log("Producto eliminado:", response.data);
      return response.data;
    } catch (error) {
      console.error(`Error en productService.delete(${id}):`, error);
      throw error;
    }
  },
};
