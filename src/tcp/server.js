const net = require('net');

const server = net.createServer({});

server.on('listening', err => {
  console.log(err, 'listening');
});
server.on('connection', socket => {
  console.log(socket.address());
  socket.setEncoding('utf8');
  socket.on('data', data => {
    console.log(data);
    socket.write('write');
  });


  server.getConnections((err, count) => {
    console.log(count);

    if (count >= 2) {
      server.close();

    }
  });
});
server.on('error', err => {
  console.log(err, 'error');
});
server.on('close', err => {
  console.log(err, 'close');
});

server.listen(8088, err => {
  console.log('server is on 8088');
});