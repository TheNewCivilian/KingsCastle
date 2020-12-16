/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const emptySession = {
  userId: '',
  sessionId: '',
  dots: [],
  polygons: [],
  pointsA: 0,
  pointsB: 0,
  pointsLeft: 0,
  userA: '',
  userAUsername: '',
  userB: '',
  userBUsername: '',
  currentUsersTurn: '',
};

export default new Vuex.Store({
  state: {
    userName: '',
    connected: false,
    winner: '',
    session: emptySession,
  },
  mutations: {
    CLEAR_STATE(currentState) {
      currentState.userName = '';
      currentState.connected = false;
      currentState.winner = '';
      currentState.session = emptySession;
    },
    SET_SESSION(currentState, payload) {
      currentState.session = payload;
    },
    ADD_TURN(currentState, payload) {
      currentState.session.dots = [...currentState.session.dots, {
        ...payload.newDot,
        visual: null,
      }];
      if (payload.newPolygon) {
        currentState.session.polygons = [...currentState.session.polygons, {
          ...payload.newPolygon,
          visual: null,
        }];
      }
      currentState.session.currentUsersTurn = payload.currentUsersTurn;
      currentState.session.pointsLeft = payload.pointsLeft;
      currentState.session.pointsA = payload.pointsA;
      currentState.session.pointsB = payload.pointsB;
    },
    SET_CONNECTED(currentState, payload) {
      currentState.connected = payload;
    },
    SET_WINNER(currentState, payload) {
      currentState.winner = payload.winner;
    },
  },
  actions: {
    initSession(context, payload) {
      context.commit('SET_SESSION', payload);
    },
    addTurn(context, payload) {
      context.commit('ADD_TURN', payload);
    },
    connect(context) {
      context.commit('SET_CONNECTED', true);
    },
    disconnect(context) {
      context.commit('SET_CONNECTED', false);
    },
    setWinner(context, payload) {
      context.commit('SET_WINNER', payload);
    },
    clearState(context) {
      context.commit('CLEAR_STATE');
    },
  },
  getters: {
    joined(currentState) {
      return currentState.session.sessionId !== '';
    },
    userAUsername(currentState) {
      return currentState.session.userAUsername;
    },
    userBUsername(currentState) {
      return currentState.session.userBUsername;
    },
    pointsA(currentState) {
      return currentState.session.pointsA;
    },
    pointsB(currentState) {
      return currentState.session.pointsB;
    },
    pointsLeft(currentState) {
      return currentState.session.pointsLeft;
    },
    allUsersPresent(currentState) {
      return currentState.session.userA
        && currentState.session.userA !== ''
        && currentState.session.userB
        && currentState.session.userB !== '';
    },
    sessionId(currentState) {
      return currentState.session.sessionId;
    },
    isPlayersTurn(currentState) {
      return currentState.session.currentUsersTurn === currentState.session.userId;
    },
    dots(currentState) {
      return currentState.session.dots;
    },
    polygons(currentState) {
      return currentState.session.polygons;
    },
    connected(currentState) {
      return currentState.connected;
    },
    finished(currentState) {
      return currentState.winner && currentState.winner !== '';
    },
    winner(currentState) {
      return currentState.winner === currentState.session.userId;
    },
    spectators(currentState) {
      return currentState.session.spectators.map((spectator) => spectator.username);
    },
  },
});
