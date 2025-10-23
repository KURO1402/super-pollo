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

// Función para enviar el correo
async function enviarCorreoPrueba() {
  try {
    const info = await transporter.sendMail({
      from: `"Super Pollo" <${process.env.EMAIL_USER}>`,
      to: 'yauripablo70@gmail.com', // cambia por el correo al que quieres enviar
      subject: 'Correo de prueba 📨',
      text: '¡Hola! Este es un correo de prueba enviado desde Node.js con Nodemailer.'
    });

    console.log('✅ Correo enviado:', info.response);
  } catch (error) {
    console.error('❌ Error al enviar correo:', error);
  }
}

enviarCorreoPrueba();
