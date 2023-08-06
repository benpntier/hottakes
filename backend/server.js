const http = require('http');
const app = require('./app');


// renvoie un port valide
const normalizePort = val => {
  const port = parseInt(val, 10);

  // port sous la forme de chaine
  if (isNaN(port)) {
    return val;
  }
  // port sous la forme de numero
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


// recherche les différentes erreurs et les gère de manière appropriée
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


const server = http.createServer(app);

// enregistre errorHandler() dans le serveur pour la gestion d'erreur
server.on('error', errorHandler);

// écouteur d'évènement, consignant le port ou le canal sur lequel le serveur s'exécute dans la console
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);
