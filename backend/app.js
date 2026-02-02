const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// application Express
const app = express();

// gérer la ressource 'images' de manière statique (sous-répertoire de notre répertoire de base)
app.use('/images', express.static(path.join(__dirname, 'images')));

// connexion à la base de données
mongoose.connect('mongodb+srv://'+process.env.DB_NAME+':'+process.env.DB_PSSWRD+'@cluster0.webpibt.mongodb.net/?appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// headers de gestion d'erreurs de CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, X-Auth-Token, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// middlewares pour lire et analyser le corps de la requête
app.use(bodyParser.json());
app.use(express.json());

// routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;