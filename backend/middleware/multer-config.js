const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

const storage = multer.diskStorage({
  // enregistrer les fichiers dans le dossier image
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // utiliser un timestamp comme nom de fichier
  filename: (req, file, callback) => {
    //const name = file.originalname.split(' ').join('_'); // remplacer les espaces par des underscores
    const extension = MIME_TYPES[file.mimetype];
    callback(null, + Date.now() + "." + extension);
  }
});

// gérer uniquement les téléchargements de fichiers uniques image
module.exports = multer({storage: storage}).single('image');