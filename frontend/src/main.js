import Vue from 'vue';
import VueNativeSock from 'vue-native-websocket';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
const webSocketURL = process.env.NODE_ENV === 'production' ? 'wss://api.kingscastle.io' : 'ws://localhost:3031';
Vue.use(VueNativeSock, webSocketURL, { reconnection: true, reconnectionDelay: 100, format: 'json' });

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
