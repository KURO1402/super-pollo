require('dotenv').config();
const nodemailer = require('nodemailer');

// Configuración del transporte (usa tu .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = transporter;