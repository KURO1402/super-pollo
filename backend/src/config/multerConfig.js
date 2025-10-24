const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento temporal
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../imagenes'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
  }
});

// Filtro para permitir solo imágenes PNG o JPG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/png', 'image/jpeg'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes en formato PNG o JPG'), false);
  }
};

// Configurar el middleware multer
const upload = multer({
  storage,
  fileFilter
});

module.exports = upload;
