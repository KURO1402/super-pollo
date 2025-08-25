# 🍗 Super Pollo

Sistema web de **gestión de ventas, stock, reservas y caja** para la pollería **Super Pollo**, desarrollado con **Node.js**, **Express**, **MySQL** y **Frontend con Vite + Tailwind CSS**.  

El objetivo del sistema es mejorar el control de insumos, la eficiencia en ventas, la facturación y la organización de las reservas de clientes.

---

## 🚀 Características principales

- ✅ **Gestión de usuarios** con roles (Administrador y Usuario común).  
- ✅ **Gestión de insumos y stock** con entradas, salidas y saldos automáticos.  
- ✅ **Sistema de ventas** con generación de boletas y facturas (microservicio).  
- ✅ **Reservas de mesas** con o sin inicio de sesión.  
- ✅ **Cuadre de caja** con registro de ingresos, retiros y cierres diarios.  
- ✅ **Base de datos en MySQL** para almacenar ventas, stock y usuarios.  
- ✅ **Frontend moderno** con Vite + Tailwind CSS.  

---

## 🔧 Requisitos previos

Antes de instalar el proyecto en tu PC, asegúrate de tener:

- [Node.js](https://nodejs.org/) (v18 o superior recomendado)  
- [MySQL](https://dev.mysql.com/downloads/) (puede ser con XAMPP, WAMP o instalación nativa)  
- [Git](https://git-scm.com/)  

---

## ⚙️ Instalación y configuración en local

### 1️⃣ Clonar el repositorio
git clone https://github.com/tu-usuario/super-pollo.git
cd super-pollo
## 2️⃣ Configuración del Backend
- cd backend
- npm install
- Crear un archivo .env en la carpeta backend/ con el siguiente contenido (ajusta según tus credenciales):

- env:
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=superpollo
    JWT_SECRET=super_secreto
- Iniciar el servidor backend: npm run dev

## 3️⃣ Configuración del Frontend
- cd frontend
- npm install
- Iniciar el servidor frontend: npm run dev

## 📌 Notas importantes
- Asegúrate de que MySQL esté corriendo antes de iniciar el backend.

- Cambia las credenciales de conexión en el archivo .env si es necesario.


## 👨‍💻 Autores
- Proyecto desarrollado por el equipo de Conti Coders
```bash





