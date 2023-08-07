const Sauce = require('../models/sauce');
const fs = require('fs');


// obtenir la liste de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error: error }));
};


// obtenir une sauce selon son id
exports.getSauceById = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error: error }));
};


// création d'une sauce
exports.createSauce = (req, res, next) => {

  // récupérer les informations sur la sauce de la requête
  const sauceObject = JSON.parse(req.body.sauce);

  // supprimer l'id de la sauce (on utilisera celui généré par la BDD)
  delete sauceObject._id;

  // supprimer l'user ID par sécurité (on utilisera celui de l'authentification)
  delete sauceObject._userId;

  // création d'une sauce avec les informations
  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId, // user ID extrait du token
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0, // initialiser les likes
    dislikes: 0, // initialiser les dislikes
    usersLiked: [" "], // initialiser la liste des users ayant like
    usersdisLiked: [" "], // initialiser la liste des users ayant dislike
});
  // enregistrer la sauce dans la base de données
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce saved!'}))
    .catch(error => res.status(400).json({ error }));
};


// mettre à jour une sauce
exports.modifySauce = (req, res, next) => {
  // sauce avec de nouvelles informations
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  // on gardera l'user id de la sauce existante
  delete sauceObject.userId;

  // trouver la sauce par son id
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {
          // vérification d'authentification
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              // mettre à jour la sauce dans la base de données
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Sauce updated!'}))
              .catch(error => res.status(401).json({ error }));
          }
      })
      .catch((error) => {
          res.status(400).json({ error: error });
      });
};


// supprimer une sauce
exports.deleteSauce = (req, res, next) => {

  // trouver la sauce par son id
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          // vérification d'authentification
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              // supprimer l'image de la sauce
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  // supprimer la sauce
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Sauce deleted!'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};


// ajouter ou enlever un like ou un dislike d'une sauce
exports.likeDislikeSauce = (req, res, next) => {
    switch (req.body.like) {
        // like une sauce
        case 1:
            Sauce.findOne({_id: req.params.id})
                .then((sauce) => {
                    // si l'utilisateur n'a pas déjà dislike la sauce
                    if (!sauce.usersDisliked.includes(req.body.userId)){
                        // mettre à jour la sauce
                        Sauce.updateOne(
                            { _id: req.params.id },
                            { $push: {usersLiked: req.body.userId}, // ajouter l'ID de l'user qui like
                            $inc: {likes: +1} } // incrémenter le nombre de likes
                        )
                            .then(() => res.status(200).json({message: 'Liked!'}))
                            .catch(error => res.status(400).json({ error }));
                    } else {
                        res.status(406).json({message: 'Unauthorised!'})
                    }
                })
            break;

        // enlever un like ou un dislike
        case 0:
            Sauce.findOne({_id: req.params.id})
                .then((sauce) => {
                    // enlever un like
                    if (sauce.usersLiked.includes(req.body.userId)){
                        // mettre à jour la sauce
                        Sauce.updateOne(
                            { _id: req.params.id },
                            { $pull: {usersLiked: req.body.userId}, // enlever l'id de l'user qui avait like
                              $inc: {likes: -1} } // diminuer le nombre de likes
                        )
                        .then(() => res.status(200).json({message: 'Removed like!'}))
                        .catch(error => res.status(400).json({ error }));
                    }
                    // enlever un dislike
                    if (sauce.usersDisliked.includes(req.body.userId)){
                        // mettre à jour la sauce
                        Sauce.updateOne(
                            { _id: req.params.id }, 
                            { $pull: {usersDisliked: req.body.userId}, // enlever l'id de l'user qui avait dislike
                              $inc: {dislikes: -1} } // diminuer le nombre de dislikes
                        )
                        .then(() => res.status(200).json({message: 'Removed dislike!'}))
                        .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(400).json({ error }));
            break;

        // dislike une sauce
        case -1:
            Sauce.findOne({_id: req.params.id})
            .then((sauce) => {
                // si l'utilisateur n'a pas déjà like la sauce
                if (!sauce.usersLiked.includes(req.body.userId)){
                    // mettre à jour la sauce
                    Sauce.updateOne(
                        { _id: req.params.id }, 
                        { $push: {usersDisliked: req.body.userId}, // ajouter l'id de l'utilisateur qui dislike
                        $inc: {dislikes: +1} } // incrémenter le nombre de dislikes
                    )
                        .then(() => res.status(200).json({message: 'Disliked!'}))
                        .catch(error => res.status(400).json({ error }));
                } else {
                    res.status(406).json({message: 'Unauthorised!'})
                }
            })
            break;
        
        // erreur
        default:
            console.log(error);
    }
}