import Vue from 'vue';
import Vuex from 'vuex';
import notes from './notes';
import user from './user';
import shared from './shared';
import chat from './chat';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    notes,
    user,
    shared,
    chat,
  },
});
