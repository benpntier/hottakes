const jwt = require('jsonwebtoken');
const User = require("../models/User");
const bcrypt = require("bcrypt");
const dotenv = require('dotenv');
dotenv.config();


// création d'un utilisateur
exports.signup = (req, res, next) => {
    // hashage du mot de passe et "saler" 10 fois
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        // nouvel objet User
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // enregistrer l'utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => {console.log("erreur 400", error);
                           return(res.status(400).json({ error: error }));
                          });
      })
      .catch(error => res.status(500).json({ error: error }));
};


// identification
exports.login = (req, res, next) => {
    // trouver l'utilisateur par son e-mail
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // comparer les mots de passe chiffrés
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // création d'un token contenant l'user id comme payload
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.TOKEN_KEY,
                            // expire après 24h
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};


 exports.test = (req, res, next) => {
    res.status(200).json({
        prop: 1
    })
 }