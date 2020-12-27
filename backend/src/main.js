const WebSocket = require('ws');
const fs = require('fs');
const process = require('process');
const SocketActions = require('./websocket');
const { ROOT_FOLDER } = require('./config');
const { sendMail } = require('./mail');
const { getUnixTime } = require('./websocket/helpers');

const socketPort = 3031;
const websocket = new WebSocket.Server({ port: socketPort });

console.log(`${ROOT_FOLDER}/log/node.access.log`);
const accessStream = fs.createWriteStream(`${ROOT_FOLDER}/log/node.access.log`, { flags: 'a+' });
const errorStream = fs.createWriteStream(`${ROOT_FOLDER}/log/node.error.log`, { flags: 'a+' });

// redirect stdout / stderr
process.__defineGetter__('stdout', () => { return accessStream});
process.__defineGetter__('stderr', () => { return errorStream});

console.log(`${getUnixTime()} [START] Websocket Server started on ${socketPort}`);

websocket.on('connection', (connection) => {
    SocketActions.onConnect(websocket, connection);

    connection.on('message', (message) => {
      try {
        SocketActions.onMessage(websocket, connection, message);
      } catch (error) {
        console.log(`${getUnixTime()} [ERROR] ${error}`);
        sendMail('[ERROR]', error);
      }
    });
  
    connection.on('close', () => {
      SocketActions.onClose(websocket, connection);
    });
});