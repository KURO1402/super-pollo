const cloudinary = require("../config/cloudinaryConfig");
const fs = require('fs');

const cloudinaryService = async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'superpollo', 
        });
        fs.unlinkSync(req.file.path);

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