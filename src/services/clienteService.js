import api from "./api";

export const clienteService = {
  // CAMBIO 22: Obtener todos los clientes con rutas alternativas
  getAll: async () => {
    try {
      // Intentar primero la ruta original
      const response = await api.get("/clientes");
      return response.data;
    } catch (error) {
      console.error("Error al obtener clientes desde /clientes:", error);

      // CAMBIO 23: Intentar ruta alternativa sin 's'
      try {
        const response = await api.get("/cliente");
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener clientes desde /cliente:", secondError);
        throw error; // Lanzar el error original
      }
    }
  },

  // Obtener cliente por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.get(`/cliente/${id}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener cliente:", error);
        throw error;
      }
    }
  },

  // Crear nuevo cliente
  create: async (clienteData) => {
    try {
      const response = await api.post("/clientes", clienteData);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.post("/cliente", clienteData);
        return response.data;
      } catch (secondError) {
        console.error("Error al crear cliente:", error);
        throw error;
      }
    }
  },

  // Actualizar cliente
  update: async (id, clienteData) => {
    try {
      const response = await api.put(`/clientes/${id}`, clienteData);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.put(`/cliente/${id}`, clienteData);
        return response.data;
      } catch (secondError) {
        console.error("Error al actualizar cliente:", error);
        throw error;
      }
    }
  },

  // Eliminar cliente
  delete: async (id) => {
    try {
      const response = await api.delete(`/clientes/${id}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.delete(`/cliente/${id}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al eliminar cliente:", error);
        throw error;
      }
    }
  },

  // Buscar clientes por nombre
  searchByName: async (nombre) => {
    try {
      const response = await api.get(
        `/clientes/buscar?nombre=${encodeURIComponent(nombre)}`
      );
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.get(
          `/cliente/buscar?nombre=${encodeURIComponent(nombre)}`
        );
        return response.data;
      } catch (secondError) {
        console.error("Error al buscar clientes:", error);
        throw error;
      }
    }
  },

  // Obtener clientes por estado
  getByEstado: async (estado) => {
    try {
      const response = await api.get(`/clientes/estado/${estado}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.get(`/cliente/estado/${estado}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener clientes por estado:", error);
        throw error;
      }
    }
  },
};
