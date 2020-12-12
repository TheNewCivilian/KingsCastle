const uuid = require('uuid');
const {
  randomString,
} = require('./methods');

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
        selectedSession.spactaters.push(connection.userId)
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
  delete sessions[connection.sessionId];
  return {
    type: 'SESSION_END',
    sessionId: connection.sessionId,
    message: {
      userId: connection.userId,
      action: 'SURRENDER',
    },
  };
};

const turn = (data, connection) => {
  // Valid input data
  if (!(data.xPos && data.yPos)) {
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
    party: connection.userId,
    invalid: false,
  };
  if (!computedDots[xPos]) {
    computedDots[xPos] = {};
  }
  computedDots[xPos][yPos] = newDot;

  const resultCircle = findCircles(computedDots, newDot);

  let newPolygon;

  if (resultCircle && resultCircle.length > 3) {
    invalidateCircled(computedDots, resultCircle);
    const vertices = resultCircle.path.map((routElement) => new Two.Vector((routElement.x - resultCircle.path[0].x) * 32, (routElement.y - resultCircle.path[0].y) * 32));
    newPolygon = { vertecies: vertices, party: connection.userId };
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
    },
  };
};

module.exports = {
  join,
  surrender,
  turn,
};