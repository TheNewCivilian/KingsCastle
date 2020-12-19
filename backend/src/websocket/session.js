class Session {
  constructor(
    sessionId,
    pointsLeft,
    userA,
  ) {
    this.sessionId = sessionId;
    this.dots = [];
    this.polygons = [];
    this.pointsA = 0;
    this.pointsB = 0;
    this.pointsLeft = pointsLeft;
    this.userA = userA;
    this.userB = null;
    this.spectators = [];
    this.currentUsersTurn = userA.userId;
  }
}

module.exports = Session;