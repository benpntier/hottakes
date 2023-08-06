const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
       // extraire le token sans garder le mot-clé 'Bearer' (après l'espace)
       const token = req.headers.authorization.split(' ')[1];

       // décoder le token (s'il n'est pas valide, une erreur sera générée)
       const decodedToken = jwt.verify(token, process.env.TOKEN_KEY);

       // extraire l'user ID du token
       const userId = decodedToken.userId;

       // ajouter l'user ID à l'objet Request afin de l'exploiter dans les différentes routes
       req.auth = {
           userId: userId
       };
    // passer à l'exécution lorsque l'utilisateur est identifié
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};