/* eslint-disable dot-notation,consistent-return */
import axios from 'axios';
import jwt from 'jsonwebtoken';

axios.defaults.baseURL = 'http://localhost:3001/';

class User {
  constructor(token, refreshToken, id) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.id = id;
    localStorage.setItem('user-token', token);
    localStorage.setItem('user-refreshToken', refreshToken);
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
    async registerUser({ commit, dispatch }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const { data } = await axios.post('/api/signup', {
          username: payload.email,
          password: payload.password,
        });
        const decodedToken = jwt.decode(data.token);
        commit('setUser', new User(data.token, data.refreshToken, decodedToken.id));
        dispatch('configAxios');
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        commit('setError', error.response.data.message);
        throw error;
      }
    },

    async loginUser({ commit, dispatch }, payload) {
      commit('clearError');
      commit('setLoading', true);
      try {
        const result = await axios.post('/api/login', {
          username: payload.email,
          password: payload.password,
        });
        const data = result.data;
        window.console.dir(result);
        window.console.log(data);
        const decodedToken = jwt.decode(data.token);
        commit('setUser', new User(data.token, data.refreshToken, decodedToken.id));
        dispatch('configAxios');
        commit('setLoading', false);
      } catch (error) {
        commit('setLoading', false);
        window.console.dir(error);
        commit('setError', error.response.data.message);
        throw error;
      }
    },

    autoLoginUser({ commit, dispatch }, payload) {
      const decodedToken = jwt.decode(payload.token);
      commit('setUser', new User(payload.token, payload.refreshToken, decodedToken.id));
      dispatch('configAxios');
    },

    async logoutUser({ commit, getters, dispatch }) {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-refreshToken');
      try {
        await axios.post('/api/logout', { refreshToken: getters.user.refreshToken });
        commit('setUser', null);
        dispatch('configAxios');
      } catch (e) {
        throw e;
      }
    },

    configAxios({ commit, getters }) {
      axios.interceptors.request.use(
        (config) => {
          if (!getters.user || !getters.user.token) return config;
          const newConfig = { headers: {}, ...config };
          newConfig.headers.Authorization = `Bearer ${getters.user.token}`;
          return newConfig;
        },
        (error) => {
          window.console.error(error);
          Promise.reject(error);
        },
      );

      axios.interceptors.response.use(
        resp => resp,
        async (error) => {
          window.console.dir(error);
          if (!getters.user ||
            !getters.user.refreshToken ||
            error.response.status !== 401 ||
            error.config.retry) {
            window.console.log('in if 1 2');
            throw error;
          }
          let refreshRequest;
          window.console.log('after if 1');
          if (!refreshRequest) {
            window.console.log('in if 2 1');
            refreshRequest = axios.post('/api/refresh', { refreshToken: getters.user.refreshToken });
            window.console.log('in if 2 2 ');
          }
          window.console.log('after if 2');
          const { data } = await refreshRequest;
          const decodedToken = jwt.decode(data.token);
          commit('setUser', new User(data.token, data.refreshToken, decodedToken.id));
          window.console.log('before new request');
          const newRequest = { ...error.config, retry: true };
          return axios(newRequest);
        },
      );
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
