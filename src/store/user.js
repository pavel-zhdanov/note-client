/* eslint-disable dot-notation,consistent-return */
import axios from 'axios';

class User {
  constructor(data) {
    window.console.log('CREATE USER');
    window.console.log(data);
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    window.console.log(this.refreshToken);
    this.id = data.id;
    this.email = data.username;
    this.nickname = data.nickname;
    this.avatarSrc = data.avatarSrc;
    localStorage.setItem('user-refreshToken', data.refreshToken);
    localStorage.setItem('user-token', data.token);
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
    updateUser(state, payload) {
      state.user.nickname = payload.nickname;
      state.user.avatarSrc = payload.avatarSrc;
      state.user.email = payload.username;
      state.user.id = payload.id;
    },
    updateTokens(state, payload) {
      state.user.token = payload.token;
      state.user.refreshToken = payload.refreshToken;
    },
  },
  actions: {
    async registerUser({ commit, dispatch }, payload) {
      commit('clearError');
      commit('setLoading', true);
      const image = payload.image;
      let imageSrc;
      try {
        if (image) {
          imageSrc = await dispatch('loadImage', { image });
        }
        const { data } = await axios.post('/api/signup', {
          username: payload.email,
          password: payload.password,
          nickname: payload.nickname,
          avatarSrc: imageSrc,
        });
        commit('setUser', new User(data));
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
        const { data } = await axios.post('/api/login', {
          username: payload.email,
          password: payload.password,
        });
        window.console.log(data);
        commit('setUser', new User(data));
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
        throw error;
      }
    },

    async autoLoginUser({ commit }, payload) {
      commit('setUser', new User(payload));
      commit('clearError');
      commit('setLoading', true);
      try {
        window.console.log('AUTOLOGIN1');
        const { data } = await axios.get('/api/user/');
        window.console.log(data);
        window.console.log('AUTOLOGIN');
        commit('updateUser', data);
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
      }
    },

    async logoutUser({ commit, getters }) {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-refreshToken');
      try {
        await axios.post('/api/logout', { refreshToken: getters.user.refreshToken });
        commit('setUser', null);
      } catch (e) {
        commit('setUser', null);
        throw e;
      }
    },

    async checkOnAvailable({ commit }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const { data } = await axios.post('/api/check', {
          field: payload.field,
          value: payload.value,
        });
        window.console.log(data);
        if (!data.isAvailable) throw new Error(`This ${payload.field} are not available`);
        commit('setLoading', false);
        return data.isAvailable;
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
    token(state) {
      if (state.user) {
        return state.user.token;
      }
      return null;
    },
    refreshToken(state) {
      if (state.user) {
        return state.user.refreshToken;
      }
      return null;
    },
    isUserLoggedIn(state) {
      return state.user !== null;
    },
  },
};
