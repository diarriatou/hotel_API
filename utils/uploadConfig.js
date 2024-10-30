const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads'); // Chemin direct vers le dossier upload
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;

// Dans hotelController.js, modifiez aussi le chemin de la photo :
const updateHotelPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Aucune photo fournie'
      });
    }

    // Modifiez le chemin de la photo pour pointer directement vers upload
    const photoUrl = `/uploads/${req.file.filename}`;

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { photo: photoUrl },
      { new: true, runValidators: true }
    );

    if (!updatedHotel) {
      return res.status(404).json({
        success: false,
        error: 'Hôtel non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: updatedHotel
    });

  } catch (error) {
    console.error('Erreur mise à jour photo:', error);
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};