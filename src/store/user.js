/* eslint-disable dot-notation */
import axios from 'axios';

class User {
  constructor(token) {
    this.token = token;
  }
}

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
        await axios.post('http://localhost:3001/api/v1/signup', {
          username: payload.email,
          password: payload.password,
        });
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
        throw error;
      }
    },
    async loginUser({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const result = await axios.post('http://localhost:3001/api/v1/auth', {
          username: payload.email,
          password: payload.password,
        });
        const token = result.data.token;
        localStorage.setItem('user-token', token);
        axios.defaults.headers.common['Authorization'] = token;
        commit('setUser', new User(token));
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
        throw error;
      }
    },
    autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload));
    },
    logoutUser({ commit }) {
      localStorage.removeItem('user-token');
      delete axios.defaults.headers.common['Authorization'];
      commit('setUser', null);
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
  },
};
