import api from "./api";

export const userService = {
  // CAMBIO 20: Obtener todos los usuarios con rutas alternativas
  getAllUsers: async () => {
    try {
      // Intentar primero la ruta original
      const response = await api.get("/usuarios");
      return response.data;
    } catch (error) {
      console.error("Error al obtener usuarios desde /usuarios:", error);

      // CAMBIO 21: Intentar ruta alternativa sin 's'
      try {
        const response = await api.get("/usuario");
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener usuarios desde /usuario:", secondError);
        throw error; // Lanzar el error original
      }
    }
  },

  // Obtener usuario por ID
  getUserById: async (id) => {
    try {
      const response = await api.get(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.get(`/usuario/${id}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener usuario:", error);
        throw error;
      }
    }
  },

  // Crear nuevo usuario
  createUser: async (userData) => {
    try {
      const response = await api.post("/usuarios", userData);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.post("/usuario", userData);
        return response.data;
      } catch (secondError) {
        console.error("Error al crear usuario:", error);
        throw error;
      }
    }
  },

  // Actualizar usuario
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/usuarios/${id}`, userData);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.put(`/usuario/${id}`, userData);
        return response.data;
      } catch (secondError) {
        console.error("Error al actualizar usuario:", error);
        throw error;
      }
    }
  },

  // Eliminar usuario
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/usuarios/${id}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.delete(`/usuario/${id}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al eliminar usuario:", error);
        throw error;
      }
    }
  },

  // Cambiar estado del usuario
  toggleUserStatus: async (id) => {
    try {
      const response = await api.patch(`/usuarios/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.patch(`/usuario/${id}/toggle-status`);
        return response.data;
      } catch (secondError) {
        console.error("Error al cambiar estado del usuario:", error);
        throw error;
      }
    }
  },

  // Obtener usuarios por rol
  getUsersByRole: async (roleName) => {
    try {
      const response = await api.get(`/usuarios/rol/${roleName}`);
      return response.data;
    } catch (error) {
      // Intentar ruta alternativa
      try {
        const response = await api.get(`/usuario/rol/${roleName}`);
        return response.data;
      } catch (secondError) {
        console.error("Error al obtener usuarios por rol:", error);
        throw error;
      }
    }
  },
};
