const express = require('express');
const router = express.Router();

// middlewares
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// contrôleurs
const sauceCtrl = require('../controllers/sauce');
const sauce = require('../models/sauce');

// routes sauce
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getSauceById);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.likeDislikeSauce);

module.exports = router;