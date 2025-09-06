import { FaWhatsapp } from "react-icons/fa";

const BotonWhatsapp = () => {
  // función para manejar el clic del botón
    const handleWhatsappClick = () => {
    // número de teléfono y mensaje predefinido
    const numeroCelular = "938896062";
    const mensaje = "Hola, estoy interesado en trabajar con ustedes en SUPER POLLO";
    // se crea la URl de WhatsApp, encodeURIComponent para codificar el mensaje
    const whatsappUrl = `https://wa.me/${numeroCelular}?text=${encodeURIComponent(mensaje)}`;
    // se abre la URL en una nueva pestaña
    window.open(whatsappUrl, '_blank');
};

  return (
    <button
      onClick={handleWhatsappClick} 
      className="relative bg-azul-secundario border-2 border-green-500 text-green-500 font-bold py-3 px-6 rounded-lg transition-all duration-300 group overflow-hidden"
    >
      {/* Efecto de iluminación externa*/}
      <div className="absolute -inset-4 bg-green-500/0 group-hover:bg-green-500/20 rounded-xl blur-xl transition-all duration-500 group-hover:scale-110"></div>
      
      {/* Efecto de brillo interno*/}
      <div className="absolute inset-0 bg-green-500/0 group-hover:bg-green-500/5 rounded-lg transition-all duration-300"></div>

      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center space-x-3">
        <FaWhatsapp className="text-xl md:text-2xl" />
        <span className="text-sm md:text-base">Contactar por WhatsApp</span>
      </div>
    </button>
  );
};

export default BotonWhatsapp;