const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom de l\'hôtel est requis'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'L\'adresse est requise'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis']
  },
  currency: {
    type: String,
    enum: ['XOF', 'EUR', 'USD'],
    default: 'XOF'
  },
  photo: {
    type: String,
    
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Hotel', hotelSchema);