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

const sendSurrender = (socket, data) => {
  sendCommand(
    socket,
    'SURRENDER',
    data,
  );
};

const sendTurn = (socket, data) => {
  sendCommand(
    socket,
    'TURN',
    data,
  );
};

const onResponse = (route, socket, store, router, response) => {
  const data = JSON.parse(response.data);
  if (data.method === 'SESSION_INIT') {
    store.dispatch('initSession', data.payload);
    router.push({ name: 'Session', query: { sid: data.payload.sessionId } });
  }
  if (data.method === 'SESSION_SPECTATE') {
    if (data.payload.spectators.some((spectator) => spectator.userId === store.getters.userId)) {
      store.dispatch('initSession', data.payload);
      router.push({ name: 'Session', query: { sid: data.payload.sessionId } });
    } else {
      store.dispatch('setSpectators', data.payload.spectators);
    }
  }
  if (data.method === 'SPECTATOR_LEAVE') {
    store.dispatch('setSpectators', data.payload);
  }
  if (data.method === 'SESSION_UPDATE') {
    store.dispatch('addTurn', data.payload);
  }
  if (data.method === 'SESSION_END') {
    store.dispatch('setWinner', data.payload);
  }
  if (data.method === 'CONNECT') {
    store.dispatch('connect');
    if (route.name === 'Session' && store.getters.joined) {
      console.log('Reconnect');
      sendCommand(
        socket,
        'CONNECT',
        { userId: store.getters.userId },
      );
    }
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
