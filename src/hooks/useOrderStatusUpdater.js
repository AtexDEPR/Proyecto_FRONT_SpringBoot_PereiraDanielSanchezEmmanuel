"use client";

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

export const useOrderStatusUpdater = (initialStatus) => {
  const { user } = useAuth();

  useEffect(() => {
    // Solo mostrar mensaje informativo para administradores y operadores
    if (user && (user.rol === "ADMINISTRADOR" || user.rol === "OPERADOR")) {
      console.log(
        "Sistema de actualización automática de pedidos activo en el backend"
      );
      console.log(
        "Los pedidos se actualizarán automáticamente cada 30 segundos"
      );
    }
  }, [user]);

  // Retornar el estado inicial ya que la actualización es automática
  return {
    currentStatus: initialStatus,
    isUpdating: false,
    error: null,
  };
};
