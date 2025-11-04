require('dotenv').config();
const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,  // Ej: 'mail.tuempresa.com'
  port: process.env.EMAIL_PORT,  // Ej: 465 o 587
  secure: 'true', // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER, // tu correo completo
    pass: process.env.EMAIL_PASS  // la contraseña creada en el hosting
  }
});

module.exports = transporter;