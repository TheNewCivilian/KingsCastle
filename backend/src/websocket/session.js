const helpers = require('./helpers');

class Session {
  constructor(
    sessionId,
    pointsLeft,
    userA,
    privateSession,
  ) {
    this.sessionId = sessionId;
    this.dots = {};
    this.polygons = [];
    this.pointsA = 0;
    this.pointsB = 0;
    this.pointsLeft = pointsLeft;
    this.userA = userA;
    this.userB = null;
    this.private = privateSession;
    this.spectators = [];
    this.currentUsersTurn = userA.userId;
    this.startTime = helpers.getUnixTime();
  }
}

module.exports = Session;