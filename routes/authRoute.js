const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout
} = require('../controllers/authController');
const authent = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', authent.protect, logout);

module.exports = router;
