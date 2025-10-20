import { useState } from "react";
// Hook personalizado para manejar confirmaciones
export const useConfirmacion = () => {
  const [estadoConfirmacion, setEstadoConfirmacion] = useState({
    visible: false,
    mensaje: "",
    onConfirmar: null,
    titulo: "Confirmar acción",
  }); // estado inicial de la confirmacion
  // función para solicitar confirmacion
  const solicitarConfirmacion = (mensaje, onConfirmar, titulo = "Confirmar acción") => {
    setEstadoConfirmacion({
      visible: true,
      mensaje,
      onConfirmar,
      titulo,
    });
  };
  // funcion para ocultar confirmacion
  const ocultarConfirmacion = () => {
    setEstadoConfirmacion(prev => ({
      ...prev,
      visible: false
    }));
  };
  // funcion para confirmar accion
  const confirmarAccion = () => {
    if (estadoConfirmacion.onConfirmar) { // si hay una funcion de confirmacion, la ejecutamos
      estadoConfirmacion.onConfirmar(); // ejecutamos
    }
    ocultarConfirmacion(); // ocultamos la confirmacion
  };

  return {
    // Estados
    confirmacionVisible: estadoConfirmacion.visible,
    mensajeConfirmacion: estadoConfirmacion.mensaje,
    tituloConfirmacion: estadoConfirmacion.titulo,
    
    // Acciones
    solicitarConfirmacion,
    ocultarConfirmacion,
    confirmarAccion,
  };
};