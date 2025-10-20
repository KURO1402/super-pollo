import { ToastContainer } from 'react-toastify';
import { useTheme } from '../modulos/panel-administrador/context/ThemeContext';

const ToastTemaWrapper = () => {
  const { theme } = useTheme(); // Obtener el tema del contexto

  // Determinar el tema para Toastify
  const toastTheme = theme === 'light' ? 'light' : 'dark';

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