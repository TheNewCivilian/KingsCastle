const WebSocket = require('ws');
const fs = require('fs');
const process = require('process');
const SocketActions = require('./websocket');

const socketPort = 3031;
const websocket = new WebSocket.Server({ port: socketPort });

const access = fs.createWriteStream('./log/node.access.log', { flags: 'a+' });
const error = fs.createWriteStream('./log/node.error.log', { flags: 'a+' });

// redirect stdout / stderr
process.__defineGetter__('stdout', () => { return access});
process.__defineGetter__('stderr', () => { return error});

console.log(`Websocket Server started on ${socketPort}`);

websocket.on('connection', (connection) => {
  SocketActions.onConnect(websocket, connection);

  connection.on('message', (message) => {
    SocketActions.onMessage(websocket, connection, message);
  });

  connection.on('close', () => {
    SocketActions.onClose(websocket, connection);
  });
});