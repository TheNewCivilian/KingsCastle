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
  },
  actions: {
    initSession(context, payload) {
      context.commit('SET_SESSION', payload);
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
  },
});
