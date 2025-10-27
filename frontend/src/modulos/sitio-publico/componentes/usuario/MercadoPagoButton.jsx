import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { SiMercadopago } from "react-icons/si";

// Inicializamos Mercado Pago con el public key
initMercadoPago('TEST-12345678-1234-1234-1234-123456789012');

const MercadoPagoButton = ({ 
  monto, 
  datosReserva, 
  onPaymentSuccess, 
  onPaymentError,
  disabled 
}) => {
  // configuramos la preferencia de id pero esto vendría del backend
  const preferenceId = "TU_PREFERENCE_ID_AQUI";

  const customization = {
    visual: {
      buttonBackground: "black",
      borderRadius: "8px"
    },
    texts: {
      action: "pay",
      valueProp: "security_safety"
    }
  };

  if (disabled) {
    return (
      <button 
        disabled
        className="w-full p-1 rounded-xl font-extrabold text-lg bg-gray-600 text-gray-400 cursor-not-allowed flex items-center justify-center gap-3"
      >
        <SiMercadopago className="w-15 h-16 text-gray-500" />
        Datos incompletos
      </button>
    );
  }

  return (
    <div className="w-full">
      <Wallet 
        initialization={{ preferenceId }}
        customization={customization}
        onSubmit={() => console.log("Iniciando pago...")}
        onReady={() => console.log("Wallet ready")}
        onError={(error) => {
          console.error("Error en Mercado Pago:", error);
          onPaymentError?.(error);
        }}
      />
    </div>
  );
};

export default MercadoPagoButton;