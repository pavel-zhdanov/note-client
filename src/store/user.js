import Axios from 'axios';

// class User {
//   constructor(id) {
//     this.id = id;
//   }
// }

export default {
  state: {
    user: null,
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
  },
  actions: {
    async registerUser({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const result = await Axios.post('http://localhost:3001/api/v1/signup', {
          username: payload.email,
          password: payload.password,
        });
        if (result.status !== 200) throw new Error('something do error');
        window.console.log(result.data);
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.message);
        throw error;
      }
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
};
