/* eslint-disable no-param-reassign */
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    userName: '',
    session: {
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
    },
  },
  mutations: {
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
    },
  },
  actions: {
    initSession(context, payload) {
      context.commit('SET_SESSION', payload);
    },
    addTurn(context, payload) {
      context.commit('ADD_TURN', payload);
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
  },
});
