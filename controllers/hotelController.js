const Hotel = require('../models/hotel');

// Obtenir tous les hôtels
const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find({}); //userId: req.user._id
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    console.error('Erreur getHotels:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};


// Obtenir un hôtel spécifique
const getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hôtel non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

// Créer un hôtel
const createHotel = async (req, res) => {
  try {
    const hotelData = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
      phone: req.body.phone,
      price: req.body.price,
      currency: req.body.currency,
    //userId:req.user._id, // Ajouter l'userId de l'utilisateur connecté
      photo: req.file ? `${req.file.filename}` : null // Utilisez le chemin du fichier téléchargé
    };

    const hotel = await Hotel.create(hotelData);
    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Mettre à jour un hôtel

const updateHotel = async (req, res) => {
  try {
    console.log('File:', req.file); // Pour voir si le fichier est bien reçu
    console.log('Body:', req.body); // Pour voir le contenu du body

    const hotel = await Hotel.findByIdAndUpdate(req.params.id, {...req.body,photo: req.file.path}, {
      new: true,
      runValidators: true
      
    });
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hôtel non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Supprimer un hôtel
const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({
        success: false,
        error: 'Hôtel non trouvé'
      });
    }
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur'
    });
  }
};

module.exports = {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
};