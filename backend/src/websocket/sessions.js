const Errors = require('./errors');
const {
  findCircles,
  invalidateCircled,
  getUnixTime,
  randomString,
} = require('./helpers');
const User = require('./user');
const Session = require('./session');

sessions = {};
archive = [];

const join = (data, connection) => {
  // validate Input data
  console.log(data);
  if (!(data.username && data.userId
      && ('sessionId' in data || 'dotCount' in data && 'private' in data ))
  ) {
    return Errors.WRONG_PARMS_FOR_JOIN;
  }

  connection.user = new User(data.username, data.userId, getUnixTime());

  // Check is user is known. Resend session data.
  // const presentSession = sessions.find(
  //   (session) => session.userA.userId === data.user.userId
  //     || session.userB.userId === data.user.userId,
  // );
  // if (presentSession) {
  //   return {
  //     type: 'USER_RECONNECT',
  //     sessionId: presentSession.sessionId,
  //     message: presentSession,
  //   };
  // }

  // Opening new Session
  if ('dotCount' in data && 'private' in data) {
    console.log(Object.keys(sessions).length);
    if (Object.keys(sessions).length > 100) {
      return Errors.MAXIMUM_SESSIONS_REACHED;
    }
  
    let sessionId = randomString();
    while(sessions[sessionId]) {
      sessionId = randomString();
    }
    sessions[sessionId] = new Session(
      sessionId,
      data.dotCount,
      connection.user,
    );
    connection.sessionId = sessionId;
    return {
      type: 'SESSION_INIT',
      sessionId: sessionId,
      message: sessions[sessionId],
    };
  }

  // Join existing Session
  if (data.sessionId) {
    const selectedSession = sessions[data.sessionId];
    if (!selectedSession) {
      return Errors.SESSION_NOT_FOUND;
    }
    if (!selectedSession.userB) {
      selectedSession.userB = connection.user;
    } else {
      selectedSession.spectators.push(connection.user)
    }
    connection.sessionId = data.sessionId;
    return {
      type: 'SESSION_INIT',
      sessionId: data.sessionId,
      message: selectedSession,
    };
  }

  // Join a randome session
  unocupiedSessionKey = Object.keys(sessions).find((sessionKey) => sessions[sessionKey].userB === null);

  if (unocupiedSessionKey) {
    const unocupiedSession = sessions[unocupiedSessionKey]
    unocupiedSession.userB = connection.user;
    connection.sessionId = unocupiedSession.sessionId;
    return {
      type: 'SESSION_INIT',
      sessionId: unocupiedSession.sessionId,
      message: unocupiedSession,
    };
  }
  return Errors.SESSION_NOT_FOUND;
};

const endGame = (currentSession, winner) => {
  archive.push(currentSession);
  delete sessions[currentSession.sessionId];
  return {
    type: 'SESSION_END',
    sessionId: currentSession.sessionId,
    message: {
      action: 'SESSION_END',
      winner,
    },
  };
}

const surrender = (connection) => {
  const currentSession = sessions[connection.sessionId];
  if (!currentSession) {
    return Errors.SESSION_NOT_FOUND;
  }

  // If user is player -> game over
  if (
    connection.user.userId === currentSession.userA.userId
    || connection.user.userId === currentSession.userB.userId
  ) {
    const winner = connection.user.userId === currentSession.userA.userId ? currentSession.userB : currentSession.userA;
    return endGame(currentSession, winner);
  }

  // If user is just a spectator
  currentSession.spectators.filter((spectator) => spectator.userId !== connection.user.userId);
  return {
    type: 'SESSION_UPDATE',
    sessionId: currentSession.sessionId,
    message: {
      action: 'SPECTATOR_LEAVE',
      spectators: currentSession.spectators,
    },
  };
};

const turn = (data, connection) => {
  // Valid input data
  if (!('xPos' in data && 'yPos' in data)) {
    return Errors.WRONG_PARMS_FOR_TURN;
  }

  // Find corresponding session
  const currentSession = sessions[connection.sessionId];
  if (!currentSession) {
    return Errors.SESSION_NOT_FOUND;
  }

  // Its not users turn
  if (currentSession.currentUsersTurn !== connection.user.userId) {
    return Errors.NOT_USERS_TURN;
  }

  // Dot might be already present
  const computedDots = currentSession.dots;
  if (computedDots[data.xPos] && computedDots[data.xPos][data.yPos]) {
    return Errors.POINT_ALREADY_PRESENT;
  }

  // Add Dot
  const newDot = {
    x: data.xPos,
    y: data.yPos,
    party: connection.user.userId === currentSession.userA.userId ? 'userA' : 'userB',
    invalid: false,
  };
  if (!computedDots[data.xPos]) {
    computedDots[data.xPos] = {};
  }
  computedDots[data.xPos][data.yPos] = newDot;

  // Decrease Points left
  if (connection.user.userId === currentSession.userB.userId) {
    currentSession.pointsLeft -= 1;
    if (currentSession.pointsLeft <= 0) {
      let winner = currentSession.pointsA > currentSession.pointsB ? currentSession.userA : currentSession.userB;
      if (currentSession.pointsA == currentSession.pointsB) {
        winner = 'none';
      }
      return endGame(currentSession, winner);
    }
  }

  // Retrieve circles
  const resultCircle = findCircles(computedDots, newDot);
  let newPolygon;
  if (resultCircle && resultCircle.length > 3) {
    const pointsMade = invalidateCircled(computedDots, resultCircle);
    if (connection.user.userId === currentSession.userA) {
      currentSession.pointsA += pointsMade;
    } else {
      currentSession.pointsB += pointsMade;
    }

    const vertices = resultCircle.path;
    newPolygon = {
      vertices: vertices,
      x: resultCircle.path[0].x,
      y: resultCircle.path[0].y,
      party: connection.user.userId === currentSession.userA.userId ? 'userA' : 'userB',
    };
    currentSession.polygons.push(newPolygon);
  }

  // Let next player play its turn.
  if (connection.user.userId === currentSession.userA.userId) {
    currentSession.currentUsersTurn = currentSession.userB.userId;
  } else {
    currentSession.currentUsersTurn = currentSession.userA.userId;
  }
  return {
    type: 'SESSION_UPDATE',
    sessionId: connection.sessionId,
    message: {
      type: 'OBJECT',
      currentUsersTurn: currentSession.currentUsersTurn,
      newDot: newDot,
      newPolygon: newPolygon,
      pointsLeft: currentSession.pointsLeft,
      pointsB: currentSession.pointsB,
      pointsA: currentSession.pointsA,
    },
  };
};

module.exports = {
  join,
  surrender,
  turn,
};