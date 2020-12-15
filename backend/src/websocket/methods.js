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
      websocket.clients.forEach((client) => {
        if (client.sessionId == response.sessionId) {
          sendMessageObject(client, response.type, { ...response.message, userId: client.userId });
        }
      });
      break;
    default:
      sendMessageObject(connection, response.type, response.message);
  }
}

const randomString = (length = 5) => {
  // Declare all characters
  let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  // Pick characers randomly
  let str = '';
  for (let i = 0; i < length; i++) {
      str += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return str;
};

module.exports = {
  sendMessageObject,
  sendResponse,
  randomString,
};