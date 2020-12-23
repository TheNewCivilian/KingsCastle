/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';
import { v4 as uuidv4 } from 'uuid';

Vue.use(Vuex);

const emptySession = {
  sessionId: '',
  dots: [],
  polygons: [],
  pointsA: 0,
  pointsB: 0,
  pointsLeft: 0,
  userA: null,
  userB: null,
  currentUsersTurn: '',
};

export default new Vuex.Store({
  state: {
    error: '',
    userName: '',
    userId: uuidv4(),
    connected: false,
    winner: '',
    session: emptySession,
  },
  mutations: {
    SET_ERROR(currentState, payload) {
      currentState.error = payload;
    },
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
    setError(context, payload) {
      context.commit('SET_ERROR', payload);
    },
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
    error(currentState) {
      return currentState.error;
    },
    joined(currentState) {
      return currentState.session.sessionId !== '';
    },
    userId(currentState) {
      return currentState.userId;
    },
    userA(currentState) {
      return currentState.session.userA;
    },
    userB(currentState) {
      return currentState.session.userB;
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
        && currentState.session.userB;
    },
    sessionId(currentState) {
      return currentState.session.sessionId;
    },
    isPlayersTurn(currentState) {
      return currentState.session.currentUsersTurn === currentState.userId;
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
      return currentState.winner.userId === currentState.userId;
    },
    spectators(currentState) {
      return currentState.session.spectators;
    },
  },
});
