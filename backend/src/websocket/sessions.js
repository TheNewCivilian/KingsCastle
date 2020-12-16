const uuid = require('uuid');
const {
  randomString,
} = require('./methods');

const {
  findCircles,
  invalidateCircled,
} = require('./helpers');

sessions = {};
archive = [];

const join = (data, connection) => {
  // validate Input data
  console.log(data);
  if (!(data.username && (data.sessionId  || data.dotCount ))) {
    return {
      type: 'error',
      message: 'WRONG_PARMS_FOR_JOIN',
    };
  }

  connection.username = data.username;
  connection.userId = uuid.v4();
  // Join existing Session
  if (data.sessionId) {
    const selectedSession = sessions[data.sessionId];
    if (selectedSession) {
      if (selectedSession.userB == '') {
        selectedSession.userB = connection.userId;
        selectedSession.userBUsername = connection.username;
      } else {
        selectedSession.spectators.push({id: connection.userId, username: connection.username })
      }
      connection.sessionId = data.sessionId;
      return {
        type: 'SESSION_INIT',
        sessionId: data.sessionId,
        message: selectedSession,
      };
    }
    return {
      type: 'ERROR',
      message: 'SESSION_NOT_FOUND',
    };
  }
  // Opening new Session
  console.log(Object.keys(sessions).length);
  if (Object.keys(sessions).length > 100) {
    return {
      type: 'ERROR',
      message: 'MAXIMUM_SESSIONS_REACHED',
    };
  }
  newSessionId = randomString();
  while(sessions[newSessionId]) {
    newSessionId = randomString();
  }
  sessions[newSessionId] = {
    sessionId: newSessionId,
    dots: [],
    polygons: [],
    pointsA: 0,
    pointsB: 0,
    pointsLeft: data.dotCount,
    userA: connection.userId,
    userAUsername: connection.username,
    userB: '',
    userBUsername: '',
    spectators: [],
    currentUsersTurn: connection.userId,
  };
  connection.sessionId = newSessionId;
  return {
    type: 'SESSION_INIT',
    sessionId: newSessionId,
    message: sessions[newSessionId],
  };
};

const surrender = (connection) => {
  const currentSession = sessions[connection.sessionId];
  if (!currentSession) {
    return {
      type: 'ERROR',
      message: 'SESSION_NOT_FOUND',
    };
  }
  archive.push(currentSession);
  const winner = connection.userId === currentSession.userA ? currentSession.userB : currentSession.userA;
  delete sessions[connection.sessionId];
  return {
    type: 'SESSION_END',
    sessionId: connection.sessionId,
    message: {
      action: 'SESSION_END',
      winner,
    },
  };
};

const turn = (data, connection) => {
  // Valid input data
  if (!('xPos' in data && 'yPos' in data)) {
    return {
      type: 'ERROR',
      message: 'WRONG_PARMS_FOR_TURN',
    };
  }
  // Find corresponding session
  const currentSession = sessions[connection.sessionId];
  if (!currentSession) {
    return {
      type: 'ERROR',
      message: 'SESSION_NOT_FOUND',
    };
  }
  if (currentSession.currentUsersTurn !== connection.userId) {
    return {
      type: 'ERROR',
      message: 'NOT_USERS_TURN',
    };
  }

  const computedDots = currentSession.dots;
  // ADD DOT
  const newDot = {
    x: data.xPos,
    y: data.yPos,
    party: connection.userId === currentSession.userA ? 'userA' : 'userB',
    invalid: false,
  };
  if (!computedDots[data.xPos]) {
    computedDots[data.xPos] = {};
  }
  if (computedDots[data.xPos][data.yPos]) {
    return {
      type: 'ERROR',
      message: {
        error: true,
        message: 'Point already present',
      }
    }
  }
  computedDots[data.xPos][data.yPos] = newDot;

  if (connection.userId === currentSession.userB) {
    currentSession.pointsLeft -= 1;
    // TODO END GAME HERE
    if (currentSession.pointsLeft <= 0) {
      archive.push(currentSession);
      let winner = currentSession.pointsA > currentSession.userB ? currentSession.userA : currentSession.userB;
      if (connection.pointsA == currentSession.userB) {
        winner = 'none';
      }
      delete sessions[connection.sessionId];
      return {
        type: 'SESSION_END',
        sessionId: connection.sessionId,
        message: {
          action: 'SESSION_END',
          winner,
        },
      };
    }
  }

  const resultCircle = findCircles(computedDots, newDot);

  let newPolygon;

  if (resultCircle && resultCircle.length > 3) {
    const pointsMade = invalidateCircled(computedDots, resultCircle);
    if (connection.userId === currentSession.userA) {
      currentSession.pointsA += pointsMade;
    } else {
      currentSession.pointsB += pointsMade;
    }

    const vertices = resultCircle.path;
    newPolygon = {
      vertices: vertices,
      x: resultCircle.path[0].x,
      y: resultCircle.path[0].y,
      party: connection.userId === currentSession.userA ? 'userA' : 'userB',
    };
    currentSession.polygons.push(newPolygon);
  }

  // Let next player play its turn.
  if (connection.userId === currentSession.userA) {
    currentSession.currentUsersTurn = currentSession.userB;
  } else {
    currentSession.currentUsersTurn = currentSession.userA;
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