require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });//Cargar variables de entorno
const mysql = require('mysql2/promise');//Importamos mysql2  y con promesas para usar asincronismo

// Configura tu conexión a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST, //Direccion del servidor
  user: process.env.DB_USER, //usuario con acceso a la base de datos
  password: process.env.DB_PASSWORD, //Contraseña del usaurio
  database: process.env.DB_NAME, //Nombre de la base de datos
  waitForConnections: true, //Si as conexiones estan ocupadas espera a que se libere alguna
  connectionLimit: 15, //Limite de conexiones
  queueLimit: 0 //Numero de consultas limite (0 por que no tiene limites)
});

//Exportar el modulo de conexiona la base de datos
module.exports = pool;