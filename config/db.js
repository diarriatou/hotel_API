const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    console.log('URI:', process.env.MONGO_URI.replace(/:([^:@]{8})[^:@]*@/, ':****@')); // Masque le mot de passe

    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log(`MongoDB connecté: ${mongoose.connection.host}`);
    
    // Test de la connexion
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));

  } catch (error) {
    console.error('Erreur de connexion MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
