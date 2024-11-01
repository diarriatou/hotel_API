const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => { //// on Vérifie la présence et validité du token JWT
  try {
    let token;
   //  Extraction du token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    //  Vérification de la présence du token
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Non autorisé - Token manquant'
      });
    }

    // Vérifier et valider le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à la requête
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Non autorisé - Token invalide'
    });
  }
};

exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Accès refusé - Droits administrateur requis'
    });
  }
};