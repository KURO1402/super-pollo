import { ToastContainer } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../modulos/panel-administrador/context/ThemeContext';

const ToastTemaWrapper = () => {
  const location = useLocation(); // Obtener la ubicación actual
  const { theme } = useTheme(); // Obtener el tema del contexto

  const esRutaAdmin = location.pathname.startsWith('/admin');

  // Determinar el tema para Toastify
  const toastTheme = esRutaAdmin && theme === 'dark' ? 'dark' : 'light';

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={toastTheme}
      limit={5}
    />
  );
};

export default ToastTemaWrapper;