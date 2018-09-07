/* eslint-disable dot-notation,no-extra-boolean-cast */
import Vue from 'vue';
import Vuetify from 'vuetify';
import SocketIO from 'socket.io-client';
import VueSocketIO from 'vue-socket.io';
import 'vuetify/dist/vuetify.min.css';
// import colors from 'vuetify/es5/util/colors';
import App from './App';
import router from './router';
import store from './store/index';
import config from './config';


const SocketInstance = SocketIO(config.server);

Vue.use(VueSocketIO, SocketInstance, store);

Vue.use(Vuetify, {
  theme: {
    primary: '#4c75a3',
    secondary: '#b0bec5',
    accent: '#8c9eff',
    error: '#b71c1c',
  } });
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  created() {
    const data = {};
    data.token = localStorage.getItem('user-token');
    data.refreshToken = localStorage.getItem('user-refreshToken');
    if (data.token && data.refreshToken) {
      this.$store.dispatch('autoLoginUser', data)
        .then()
        .catch();
    }
    this.$store.dispatch('fetchNotes');
  },
});
