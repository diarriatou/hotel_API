const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/usersRoute');
const authRoute = require('./routes/authRoute')
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques
//app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Routes
app.use('/api/hotels', require('./routes/hotelRoute'));
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoute);
app.use('/api/users', require('./routes/usersRoute'));
// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connecté');
    const db = mongoose.connection;
    db.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error('Erreur lors de la récupération des collections:', err);
        return;
      }
      console.log('Collections disponibles:', collections.map(c => c.name));
    });
  })
  .catch((error) => console.error('Erreur de connexion MongoDB:', error));

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});