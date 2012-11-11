var app = require('pm').createMaster({
  pidfile: '/tmp/demo.pid'
});

app.register('group1', __dirname + '/worker.js', {
  listen: 1234,
  children: 1
});