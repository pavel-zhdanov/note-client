/* eslint-disable dot-notation,no-extra-boolean-cast */
import Vue from 'vue';
import Vuetify from 'vuetify';
import axios from 'axios';
import 'vuetify/dist/vuetify.min.css';
import App from './App';
import router from './router';
import store from './store/index';

Vue.use(Vuetify);
Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>',
  created() {
    const token = localStorage.getItem('user-token');
    if (token) {
      window.console.log(token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      this.$store.dispatch('autoLoginUser', token);
    }
  },
});
