// controllers/authController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
// const sendEmail = require('../utils/sendEmail');
// Générer le JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Veuillez fournir un email et un mot de passe'
      });
    }

    // Vérifier l'utilisateur
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Mettre à jour le statut
    user.status = 'en ligne';
    await user.save();

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.status = 'hors ligne';
    await user.save();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Aucun utilisateur trouvé avec cet email'
      });
    }
     // Générer un token de réinitialisation
     const resetToken = crypto.randomBytes(20).toString('hex');
     user.resetPasswordToken = crypto
       .createHash('sha256')
       .update(resetToken)
       .digest('hex');
     user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
 
     await user.save();
 
     // Créer l'URL de réinitialisation
     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
 
     // Contenu de l'email
     const message = `
       Vous recevez cet email car vous avez demandé la réinitialisation de votre mot de passe.
       Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetUrl}
       Ce lien expirera dans 10 minutes.
       Si vous n'avez pas demandé de réinitialisation, ignorez cet email.
     `;
 
     //await sendEmail({
       //email: user.email,
       //subject: 'Réinitialisation de mot de passe',
       //message
     //});
 
     res.status(200).json({
       success: true,
       data: 'Email envoyé'
     });
   } catch (error) {
     console.error('Forgot password error:', error);
     res.status(500).json({
       success: false,
       error: 'Email n\'a pas pu être envoyé'
     });
   }
 };