const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadConfig');
const authent = require('../middleware/auth');

const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');

router.route('/')
  .get(authent.protect,getHotels)
  //.post(createHotel);

router.route('/:id')
  .get(authent.protect,getHotel)
  .put(authent.protect,upload.single('photo'), updateHotel)
  .delete(authent.protect,deleteHotel);
router.post('/', authent.protect,upload.single('photo'), createHotel);
module.exports = router;