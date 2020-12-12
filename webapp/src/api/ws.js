const sendCommand = (socket, method, data = null) => {
  if (data === null) {
    socket.send(method);
  } else {
    const message = {};
    message[method] = data;
    socket.sendObj(message);
  }
};

const sendJoin = (socket, data) => {
  sendCommand(
    socket,
    'JOIN',
    data,
  );
};

const sendSurrender = (socket) => {
  sendCommand(
    socket,
    'SURRENDER',
  );
};

const sendTurn = (socket, data) => {
  sendCommand(
    socket,
    'TURN',
    data,
  );
};

const onResponse = (store, router, response) => {
  const data = JSON.parse(response.data);
  console.log(data.payload);
  if (data.method === 'SESSION_INIT') {
    store.dispatch('initSession', data.payload);
    router.push({ name: 'Session', query: { sid: data.payload.sessionId } });
  }
};

export default {
  onResponse,
  sendJoin,
  sendTurn,
  sendSurrender,
};
