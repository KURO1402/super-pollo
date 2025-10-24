const upload = require('../config/multerConfig');

const verificarImagen = (req, res, next) => {
  // Procesamos el campo "image" y permitimos como máximo 2 (para poder validar)
  upload.array('image', 2)(req, res, function (err) {
    // Error de multer (tipo de archivo inválido, etc.)
    if (err) {
      return res.status(400).json({ ok: false, message: err.message });
    }

    // Si no se envió ningún archivo
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Debes subir una sola imagen en formato PNG o JPG',
      });
    }

    // Si se enviaron más de 1 imagen
    if (req.files.length > 1) {
      return res.status(400).json({
        ok: false,
        message: 'Solo puedes subir una imagen a la vez',
      });
    }

    const file = req.files[0];

    // Todo correcto → guardar el archivo como req.file para Cloudinary
    req.file = file;
    next();
  });
};

module.exports = verificarImagen;