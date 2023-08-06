const express = require('express');
const router = express.Router();

// contrôleur
const userCtrl = require('../controllers/user');

// routes utilisateur
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;