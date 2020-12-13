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
  if (data.method === 'SESSION_INIT') {
    store.dispatch('initSession', data.payload);
    router.push({ name: 'Session', query: { sid: data.payload.sessionId } });
  }
  if (data.method === 'SESSION_UPDATE') {
    store.dispatch('addTurn', data.payload);
  }
  if (data.method === 'CONNECT') {
    store.dispatch('connect');
  }
  if (data.method === 'DISCONNECT') {
    store.dispatch('disconnect');
  }
};

export default {
  onResponse,
  sendJoin,
  sendTurn,
  sendSurrender,
};
