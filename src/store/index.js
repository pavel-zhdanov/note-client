import Vue from 'vue';
import Vuex from 'vuex';
import notes from './notes';
import user from './user';
import shared from './shared';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    notes,
    user,
    shared,
  },
});
