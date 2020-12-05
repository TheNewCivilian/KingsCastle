import Vue from 'vue';
import VueRouter from 'vue-router';
import Lobby from '../views/Lobby.vue';
import Session from '../views/Session.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Lobby',
    component: Lobby,
  },
  {
    path: '/session',
    name: 'Session',
    component: Session,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
