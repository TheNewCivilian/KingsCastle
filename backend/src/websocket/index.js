/* eslint no-param-reassign: ["error", { "props": false }] */
const Errors = require('./errors');
const session = require('./sessions');
const {
  sendMessageObject,
  sendResponse,
} = require('./methods');

const parseMessage = (message) => {
  let data;
  try {
    data = JSON.parse(message);
  } catch (e) {
    if (typeof message === 'string') {
      return { method: message };
    }
    return { error: true };
  }
  console.log(data);
  const method = Object.keys(data)[0];
  return {
    method,
    data: data[method],
  };
};

const onConnect = (connection) => {
  sendMessageObject(connection, 'CONNECT', { error: false });
};

const onMessage = (websocket, connection, message) => {
  const receivedData = parseMessage(message);

  if (receivedData.error) {
    sendResponse(connection, websocket, {
      type: 'error',
      message: Errors.dataFormatError
    });
    return;
  }

  console.log(receivedData);

  switch (receivedData.method) {
    case 'JOIN':
      sendResponse(connection, websocket, session.join(receivedData.data, connection));
      break;
    case 'SURRENDER':
      sendResponse(connection, websocket, session.surrender(connection));
      break;
    case 'TURN':
      sendResponse(connection, websocket, session.turn(receivedData.data, connection));
      break;
    default:
      sendResponse(connection, websocket, {
        type: 'error',
        message: 'METHOD_NOT_FOUND'
      });
      break;
  }
};

const onClose = (websocket, connection) => {
  console.log("connection Closed");
  // sendResponse(connection, websocket, session.surrender(connection));
};

module.exports = {
  onConnect,
  onMessage,
  onClose,
};