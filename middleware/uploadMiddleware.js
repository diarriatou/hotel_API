const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Destination où les fichiers seront stockés

// Dans votre route
app.post('/api/hotels', upload.single('photo'), async (res) => {
  try {
    const hotelData = {
      name: body.name,
      address: body.address,
      email: body.email,
      phone: body.phone,
      price: body.price,
      currency: body.currency,
      photo: file.path // Utilisez le chemin du fichier téléchargé
    };

    // Enregistrez l'hôtel dans la base de données...
    res.status(201).json({ success: true, data: hotelData }); // Envoyez une réponse positive
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'hôtel:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'hôtel' });
  }
});
