/* eslint-disable dot-notation,no-extra-boolean-cast */
import Vue from 'vue';
import Vuetify from 'vuetify';
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
