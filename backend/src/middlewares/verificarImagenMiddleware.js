const fs = require('fs');
const upload = require('../config/multerConfig');

const verificarImagen = (req, res, next) => {
  upload.array('image', 2)(req, res, function (err) {
    // Error de multer (tipo inválido, tamaño, etc.)
    if (err) {
      // Intentar eliminar cualquier archivo temporal si existe
      if (req.files && req.files.length > 0) {
        req.files.forEach((file) => {
          if (file && file.path) {
            try {
              fs.unlinkSync(file.path);
            } catch (unlinkError) {
              console.error('Error al borrar archivo inválido:', unlinkError.message);
            }
          }
        });
      } else if (req.file && req.file.path) {
        // En caso de single file
        try {
          fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
          console.error('Error al borrar archivo inválido:', unlinkError.message);
        }
      }

      return res.status(400).json({ ok: false, message: err.message });
    }

    // No se envió ningún archivo
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'Se necesita la imagen en formato PNG O JPJ',
      });
    }

    // Se enviaron más de 1 imagen → borrar todas
    if (req.files.length > 1) {
      req.files.forEach((file) => {
        if (file && file.path) {
          try {
            fs.unlinkSync(file.path);
          } catch (unlinkError) {
            console.error('Error al borrar archivo extra:', unlinkError.message);
          }
        }
      });

      return res.status(400).json({
        ok: false,
        message: 'Solo puedes subir una imagen a la vez',
      });
    }

    // ✅ Todo correcto → solo una imagen válida
    req.file = req.files[0];
    next();
  });
};

module.exports = verificarImagen;
