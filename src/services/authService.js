import api from "./api";

export const authService = {
  async login(credentials) {
    try {
      console.log("=== FRONTEND LOGIN ===");
      console.log("Enviando credenciales:", credentials);

      // POST a /auth/login - el interceptor ya maneja la URL base
      const response = await api.post("/auth/login", credentials);
      console.log("Respuesta completa del servidor:", response);
      console.log("Datos de la respuesta:", response.data);

      // Verificar si la respuesta es exitosa según tu backend
      if (response.data && response.data.success) {
        const { token, nombreUsuario, correo, rol } = response.data;

        console.log("Datos extraídos del backend:");
        console.log("- Token:", token ? "Presente" : "Ausente");
        console.log("- Usuario:", nombreUsuario);
        console.log("- Correo:", correo);
        console.log("- Rol:", rol);

        // Guardar token en localStorage (el interceptor lo usará automáticamente)
        if (token) {
          localStorage.setItem("token", token);
        }

        return {
          success: true,
          data: {
            token,
            nombreUsuario,
            correo,
            rol, // String directo según tu AuthController
          },
        };
      }

      // Si no hay success=true en la respuesta
      console.log("Respuesta sin success=true:", response.data);
      return {
        success: false,
        message: response.data?.message || "Respuesta inválida del servidor",
      };
    } catch (error) {
      console.error("=== ERROR EN LOGIN ===");
      console.error("Error completo:", error);
      console.error("Status:", error.response?.status);
      console.error("Data:", error.response?.data);

      let message = "Error al iniciar sesión";

      if (error.response) {
        switch (error.response.status) {
          case 401:
            message =
              "Credenciales incorrectas. Verifica tu usuario y contraseña.";
            break;
          case 404:
            message = "Usuario no encontrado";
            break;
          case 500:
            message = "Error interno del servidor";
            break;
          case 403:
            message = "Acceso denegado";
            break;
          default:
            // Intentar extraer mensaje del backend
            if (error.response.data?.message) {
              message = error.response.data.message;
            } else if (error.response.data?.data) {
              message = error.response.data.data;
            } else if (typeof error.response.data === "string") {
              message = error.response.data;
            }
        }
      } else if (error.request) {
        message =
          "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose en http://localhost:8080";
      } else {
        message = error.message || "Error desconocido";
      }

      return { success: false, message };
    }
  },

  async register(userData) {
    try {
      console.log("=== FRONTEND REGISTRO ===");
      console.log("Enviando datos de registro:", userData);

      // Mapear datos según tu ClienteRequest del backend
      const registrationData = {
        nombreUsuario: userData.nombreUsuario,
        contrasena: userData.contrasena,
        correo: userData.correo,
        tipo: userData.tipo, // PERSONA_NATURAL o EMPRESA
        nombre: userData.nombre,
        identificacion: userData.identificacion,
        telefono: userData.telefono,
        direccion: userData.direccion,
      };

      console.log("Datos mapeados para el backend:", registrationData);

      const response = await api.post("/auth/registro", registrationData);
      console.log("Respuesta del registro:", response);

      return { success: true, data: response.data };
    } catch (error) {
      console.error("=== ERROR EN REGISTRO ===");
      console.error("Error completo:", error);

      let message = "Error al registrar usuario";

      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.data?.data) {
        message = error.response.data.data;
      } else if (typeof error.response?.data === "string") {
        message = error.response.data;
      } else if (error.response?.status === 409) {
        message = "El usuario o correo ya existe";
      }

      throw new Error(message);
    }
  },

  // Método para obtener perfil del usuario (si tu backend lo tiene)
  async getProfile() {
    try {
      const response = await api.get("/usuarios/perfil"); // Ajusta según tu backend
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error obteniendo perfil:", error);
      return { success: false, message: "Error al obtener perfil" };
    }
  },

  // Limpiar autenticación
  clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
