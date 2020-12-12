import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueNativeSock, 'ws://localhost:3000', { reconnection: true, format: 'json' });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
