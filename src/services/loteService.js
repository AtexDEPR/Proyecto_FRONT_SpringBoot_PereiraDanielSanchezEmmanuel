import api from "./api";

export const loteService = {
  // Obtener todos los lotes
  getAllLotes: async () => {
    try {
      const response = await api.get("/api/lotes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener lotes:", error);
      throw error;
    }
  },

  // Obtener lotes disponibles
  getLotesDisponibles: async () => {
    try {
      const response = await api.get("/api/lotes/disponibles");
      return response.data;
    } catch (error) {
      console.error("Error al obtener lotes disponibles:", error);
      throw error;
    }
  },

  // Crear nuevo lote
  createLote: async (loteData) => {
    try {
      const response = await api.post("/api/lotes", loteData);
      return response.data;
    } catch (error) {
      console.error("Error al crear lote:", error);
      throw error;
    }
  },

  // Actualizar lote
  updateLote: async (id, loteData) => {
    try {
      const response = await api.put(`/api/lotes/${id}`, loteData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar lote:", error);
      throw error;
    }
  },

  // Obtener lote por ID
  getLoteById: async (id) => {
    try {
      const response = await api.get(`/api/lotes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener lote:", error);
      throw error;
    }
  },

  // Obtener lotes por estado
  getLotesByEstado: async (estado) => {
    try {
      const response = await api.get(`/api/lotes/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener lotes por estado:", error);
      throw error;
    }
  },

  // Obtener lotes por fecha de producción
  getLotesByFechaProduccion: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get(
        `/api/lotes/fecha-produccion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener lotes por fecha:", error);
      throw error;
    }
  },

  // Cambiar estado del lote
  cambiarEstadoLote: async (id, estado) => {
    try {
      const response = await api.patch(
        `/api/lotes/${id}/estado?estado=${estado}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al cambiar estado del lote:", error);
      throw error;
    }
  },

  // Verificar disponibilidad
  verificarDisponibilidad: async (id, cantidad) => {
    try {
      const response = await api.get(
        `/api/lotes/${id}/disponibilidad?cantidad=${cantidad}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al verificar disponibilidad:", error);
      throw error;
    }
  },

  // Eliminar lote
  deleteLote: async (id) => {
    try {
      const response = await api.delete(`/api/lotes/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar lote:", error);
      throw error;
    }
  },
};
