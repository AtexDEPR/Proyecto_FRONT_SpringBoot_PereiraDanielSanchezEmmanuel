import api from "./api";

export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", {
        nombreUsuario: credentials.nombreUsuario,
        contrasena: credentials.contrasena,
      });
      return response.data;
    } catch (error) {
      console.error("Error en authService.login:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      // Crear el payload para el registro de usuario y cliente
      const payload = {
        usuario: {
          nombreUsuario: userData.email.split("@")[0], // Usar parte del email como username
          contrasena: userData.password,
          correo: userData.email,
          rolId: 3, // ID del rol CLIENTE
        },
        cliente: {
          nombre: userData.nombre,
          ruc: userData.ruc,
          correo: userData.email,
          telefono: userData.telefono,
          direccion: userData.direccion,
          tipoCliente: userData.tipoCliente,
        },
      };

      const response = await api.post("/cliente/registrar", payload);
      return response.data;
    } catch (error) {
      console.error("Error en authService.register:", error);
      throw error;
    }
  },

  setAuthToken: (token) => {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  },

  removeAuthToken: () => {
    delete api.defaults.headers.common["Authorization"];
  },
};
