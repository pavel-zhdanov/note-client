import Vue from 'vue';
import Vuetify from 'vuetify';
import VueCookie from 'vue-cookie';
import 'vuetify/dist/vuetify.min.css';
import App from './App';
import router from './router';
import store from './store/index';

Vue.use(Vuetify);
Vue.use(VueCookie);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
