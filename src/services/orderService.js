import api from "./api"

export const orderService = {
  create: async (orderData) => {
    try {
      const response = await api.post("/pedidos", orderData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getByUser: async (userId) => {
    try {
      const response = await api.get(`/pedidos/cliente/${userId}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/pedidos")
      return response.data
    } catch (error) {
      throw error
    }
  },

  updateStatus: async (id, status) => {
    try {
      const response = await api.put(`/pedidos/${id}/estado`, { estado: status })
      return response.data
    } catch (error) {
      throw error
    }
  },
}
