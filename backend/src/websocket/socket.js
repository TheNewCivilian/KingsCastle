const sendMessageObject = (connection, method, payload) => {
  connection.send(JSON.stringify({ method, payload }));
};

const sendResponse = (connection, websocket, response) => {
  response.userId = connection.userId;
  switch(response.type) {
    case 'ERROR':
      sendMessageObject(connection, response.type, response.message);
      break;
    case 'SESSION_UPDATE':
    case 'SESSION_INIT':
    case 'SESSION_END':
    case 'SESSION_SPECTATE':
    case 'SPECTATOR_LEAVE':
      websocket.clients.forEach((client) => {
        if (client.sessionId == response.sessionId) {
          sendMessageObject(client, response.type, { ...response.message, userId: client.userId });
        }
      });
      break;
    case 'USER_RECONNECT':
      sendMessageObject(connection, response.type, response.message);
      break;
    default:
      sendMessageObject(connection, response.type, response.message);
  }
}

module.exports = {
  sendMessageObject,
  sendResponse,
};