const cloudinary = require("../config/cloudinaryConfig");
const fs = require('fs');

const cloudinaryService = async (req, res) => {
    try {
        // Subir la imagen a Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'superpollo', // Carpeta en Cloudinary
        });
        // Eliminar el archivo temporal del servidor
        fs.unlinkSync(req.file.path);

        // Retornar la URL pública de Cloudinary
        res.json({
            ok: true,
            mensaje: 'Imagen subida correctamente',
            url: result.secure_url,
            public_id: result.public_id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = cloudinaryService;