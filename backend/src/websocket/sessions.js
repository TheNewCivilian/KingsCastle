const Errors = require('./errors');
const {
  findCircles,
  invalidateCircled,
  getUnixTime,
  randomString,
  hashMapToList,
} = require('./helpers');
const User = require('./user');
const Session = require('./session');
const fs = require('fs');
const { ROOT_FOLDER } = require('../config');
const { sendMail } = require('../mail');
const { timeStamp } = require('console');

const sessions = {};

const saveSessionToArchive = (session) => {
  const archiveData = {
    id: session.sessionId,
    start: session.startTime,
    duration: getUnixTime() - session.startTime,
    playerA: session.userA,
    playerB: session.userB,
    spectators: session.spectators,
    private: session.private,
  }
  fs.writeFile(
    `${ROOT_FOLDER}/log/archive.data`,
    JSON.stringify(archiveData) + '\n',
    { flag: 'a+' },
    (err) => {
      if (err) throw err;
    },
  );
};

const checkSessionsAlive = () => {
  const currentTime = getUnixTime();
  Object.keys(sessions).forEach((sessionKey) => {
    const session = sessions[sessionKey];
    if ((session.userA && session.userA.lastAction < currentTime - 2400)
      || (session.userB && session.userB.lastAction < currentTime - 2400)
    ) {
      sendMail('[Timeout]', JSON.stringify(session));
      endGame(session, 'none after timeout');
    }
  });
}

const join = (data, connection) => {
  // validate Input data
  if (!(data.username && data.userId
      && ('sessionId' in data || 'dotCount' in data && 'private' in data ))
  ) {
    return Errors.WRONG_PARMS_FOR_JOIN;
  }

  connection.user = new User(data.username, data.userId, getUnixTime());

  // Opening new Session
  if ('dotCount' in data && 'private' in data) {
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
      data.private,
    );
    connection.sessionId = sessionId;
    // Check if any old session expired.
    checkSessionsAlive();
    console.log(`${getUnixTime()} [JOIN] User ${data.username} opened Session ${sessionId}`);
    return {
      type: 'SESSION_INIT',
      sessionId: sessionId,
      message: { ...sessions[sessionId], dots: []},
    };
  }

  // Join existing Session
  if (data.sessionId) {
    const selectedSession = sessions[data.sessionId];
    if (selectedSession) {
      connection.sessionId = data.sessionId;
      console.log(`${getUnixTime()} [JOIN] User ${data.username} joined Session ${data.sessionId}`);
      if (!selectedSession.userB) {
        selectedSession.userB = connection.user;
        return {
          type: 'SESSION_INIT',
          sessionId: data.sessionId,
          message: { ...selectedSession, dots: []},
        };
      } else {
        selectedSession.spectators.push(connection.user)
        return {
          type: 'SESSION_SPECTATE',
          sessionId: data.sessionId,
          message: { ...selectedSession, dots: hashMapToList(selectedSession.dots) },
        };
      }
    }
  }

  // Join a random session
  const unoccupiedSessionKey = Object.keys(sessions).find(
    (sessionKey) => sessions[sessionKey].userB === null
      && !sessions[sessionKey].private,
  );

  if (unoccupiedSessionKey) {
    const unoccupiedSession = sessions[unoccupiedSessionKey]
    unoccupiedSession.userB = connection.user;
    connection.sessionId = unoccupiedSession.sessionId;
    console.log(`${getUnixTime()} [JOIN] User ${data.username} joined random Session ${unoccupiedSession.sessionId}`);
    return {
      type: 'SESSION_INIT',
      sessionId: unoccupiedSession.sessionId,
      message: { ...unoccupiedSession, dots: []},
    };
  }
  return Errors.SESSION_NOT_FOUND;
};

const endGame = (currentSession, winner) => {
  console.log(`${getUnixTime()} [END] Session Session ${currentSession.sessionId} archived`);
  saveSessionToArchive(currentSession);
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
    type: 'SPECTATOR_LEAVE',
    sessionId: currentSession.sessionId,
    message: currentSession.spectators,
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

  // Update last user action
  if (currentSession.userA.userId === connection.user.userId) {
    currentSession.userA.lastAction = getUnixTime();
  } else if (currentSession.userB.userId === connection.user.userId) {
    currentSession.userB.lastAction = getUnixTime();
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
    if (connection.user.userId === currentSession.userA.userId) {
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