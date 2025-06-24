import api from "./api";

export const orderService = {
  // Crear pedido
  create: async (orderData) => {
    try {
      console.log("=== CREANDO PEDIDO EN FRONTEND ===");
      console.log("Datos del pedido:", orderData);

      const response = await api.post("/pedidos", orderData);
      console.log("Respuesta del servidor:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error al crear pedido:", error);
      throw error;
    }
  },

  // Obtener pedidos del usuario autenticado
  getByUser: async () => {
    try {
      console.log("=== OBTENIENDO PEDIDOS DEL USUARIO ===");

      const response = await api.get("/pedidos/mis-pedidos");

      console.log("Respuesta completa:", response);
      console.log("Datos de respuesta:", response.data);

      // Normalizar datos según la estructura del backend
      let ordersData = [];
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        ordersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        ordersData = response.data;
      } else {
        console.warn("Estructura de respuesta inesperada:", response.data);
        ordersData = [];
      }

      console.log("Pedidos procesados:", ordersData.length);

      // Debug detallado del primer pedido
      if (ordersData.length > 0) {
        console.log("Primer pedido:", ordersData[0]);
        console.log("Detalles del primer pedido:", ordersData[0].detalles);

        // Debug de cada detalle
        if (ordersData[0].detalles && ordersData[0].detalles.length > 0) {
          ordersData[0].detalles.forEach((detalle, index) => {
            console.log(`Detalle ${index}:`, {
              nombreProducto: detalle.nombreProducto,
              conservante: detalle.conservanteProducto,
              cantidad: detalle.cantidad,
              loteId: detalle.loteId,
              codigoLote: detalle.codigoLote,
            });
          });
        }
      }

      return response.data;
    } catch (error) {
      console.error("Error al obtener mis pedidos:", error);
      throw error;
    }
  },

  // Obtener todos los pedidos (admin/operador)
  getAllOrders: async () => {
    try {
      const response = await api.get("/pedidos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener todos los pedidos:", error);
      throw error;
    }
  },

  // Obtener pedido por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedido:", error);
      throw error;
    }
  },

  // Actualizar estado del pedido
  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/pedidos/${id}/estado`, {
        estado: status,
      });
      return response.data;
    } catch (error) {
      console.error(`Error actualizando estado del pedido ${id}:`, error);
      throw error;
    }
  },

  // Confirmar pedido
  confirm: async (id) => {
    try {
      const response = await api.post(`/pedidos/${id}/confirmar`);
      return response.data;
    } catch (error) {
      console.error("Error al confirmar pedido:", error);
      throw error;
    }
  },

  // Cancelar pedido
  cancel: async (id) => {
    try {
      const response = await api.post(`/pedidos/${id}/cancelar`);
      return response.data;
    } catch (error) {
      console.error("Error al cancelar pedido:", error);
      throw error;
    }
  },

  // Obtener pedidos por estado
  getByStatus: async (estado) => {
    try {
      const response = await api.get(`/pedidos/estado/${estado}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedidos por estado:", error);
      throw error;
    }
  },

  // Obtener pedidos por rango de fechas
  getByDateRange: async (fechaInicio, fechaFin) => {
    try {
      const response = await api.get(
        `/pedidos/fecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al obtener pedidos por fecha:", error);
      throw error;
    }
  },

  // Método para actualizar estado (usado por el hook de cambio automático)
  async updateOrderStatus(orderId, newStatus) {
    try {
      return await this.updateStatus(orderId, newStatus);
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },
};
