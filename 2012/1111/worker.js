var app = require('http').createServer(function (req, res) {
  res.end('hello world');
});

var counter = 0;

// app.on('clientError', function (err) {
//   console.log('[%d] clientEror %s', counter, err.stack);
// });

require('pm').createWorker().ready(function (socket, port) {
  counter++;
  console.log(counter, port, socket.remoteAddress, socket.remotePort);
  app.emit('connection', socket);
});