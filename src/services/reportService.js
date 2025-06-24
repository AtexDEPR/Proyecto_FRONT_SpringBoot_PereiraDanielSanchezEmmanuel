import api from "./api";

export const reportService = {
  // CAMBIO 24: Reportes de ventas por producto con timeout y fallback
  getVentasPorProducto: async (fechaInicio = null, fechaFin = null) => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      // CAMBIO 25: Agregar timeout a la petición
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos

      const response = await api.get(`/reportes/ventas-producto?${params}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de ventas por producto:", error);

      // CAMBIO 26: Intentar ruta alternativa
      try {
        const response = await api.get(`/reportes/ventas-producto`);
        return response.data;
      } catch (secondError) {
        console.error("Error en ruta alternativa:", secondError);
        throw error;
      }
    }
  },

  // Reportes de ventas por cliente con timeout
  getVentasPorCliente: async (fechaInicio = null, fechaFin = null) => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await api.get(`/reportes/ventas-cliente?${params}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de ventas por cliente:", error);

      try {
        const response = await api.get(`/reportes/ventas-cliente`);
        return response.data;
      } catch (secondError) {
        throw error;
      }
    }
  },

  // Reporte de producción con timeout
  getReporteProduccion: async (fechaInicio = null, fechaFin = null) => {
    try {
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await api.get(`/reportes/produccion?${params}`, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de producción:", error);

      try {
        const response = await api.get(`/reportes/produccion`);
        return response.data;
      } catch (secondError) {
        throw error;
      }
    }
  },

  // Reporte de inventario con timeout
  getReporteInventario: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await api.get("/reportes/inventario", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener reporte de inventario:", error);

      try {
        const response = await api.get("/reportes/inventario");
        return response.data;
      } catch (secondError) {
        throw error;
      }
    }
  },

  // CAMBIO 27: Estadísticas del dashboard con timeout más corto
  getDashboardStats: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos

      const response = await api.get("/reportes/dashboard", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas del dashboard:", error);

      try {
        const response = await api.get("/reportes/dashboard");
        return response.data;
      } catch (secondError) {
        throw error;
      }
    }
  },

  // Notificaciones del sistema con timeout
  getNotificaciones: async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 segundos

      const response = await api.get("/reportes/notificaciones", {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response.data;
    } catch (error) {
      console.error("Error al obtener notificaciones:", error);

      try {
        const response = await api.get("/reportes/notificaciones");
        return response.data;
      } catch (secondError) {
        throw error;
      }
    }
  },
};
