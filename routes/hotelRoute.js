const express = require('express');
const router = express.Router();
const upload = require('../utils/uploadConfig');


const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');

router.route('/')
  .get(getHotels)
  //.post(createHotel);

router.route('/:id')
  .get(getHotel)
  .put(upload.single('photo'), updateHotel)
  .delete(deleteHotel);
router.post('/', upload.single('photo'), createHotel);
module.exports = router;