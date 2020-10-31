const net = require('net');

const server = net.createServer({});

server.on('listening', err => {
  console.log(err, 'listening');
});
server.on('connection', socket => {
  socket.setEncoding('utf8');

  socket.connect('localhost', 8088);

  socket.on('data', data => { console.log(data); });
});
server.on('error', err => {
  console.log(err, 'error');
});
server.on('close', err => {
  console.log(err, 'close');
});

server.listen(8088, err => {
  console.log('server is on 8087');
});