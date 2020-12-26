import Vue from 'vue';
import VueRouter from 'vue-router';
import Lobby from '../views/Lobby.vue';
import Session from '../views/Session.vue';
import Privacy from '../views/Privacy.vue';

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
  {
    path: '/privacy',
    name: 'Privacy',
    component: Privacy,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
