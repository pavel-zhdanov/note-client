/* eslint-disable dot-notation,consistent-return */
import axios from 'axios';
import jwt from 'jsonwebtoken';

axios.defaults.baseURL = 'http://localhost:3001/';

class User {
  constructor(data) {
    window.console.log('CREATE USER');
    const decodedToken = jwt.decode(data.token);
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.id = decodedToken.id;
    this.email = decodedToken.username;
    localStorage.setItem('user-token', data.token);
    localStorage.setItem('user-refreshToken', data.refreshToken);
    this.configAxios();
  }
  configAxios() {
    axios.interceptors.request.use(
      (config) => {
        window.console.log('INTERCEPTOR ON REQUEST');
        if (!this.token) return config;
        const newConfig = { headers: {}, ...config };
        newConfig.headers.Authorization = `Bearer ${this.token}`;
        return newConfig;
      },
      (error) => {
        Promise.reject(error);
      },
    );

    axios.interceptors.response.use(
      resp => resp,
      async (error) => {
        if (!this.refreshToken ||
          error.response.status !== 401 ||
          error.config.retry) {
          throw error;
        }
        let refreshRequest;
        if (!refreshRequest) {
          refreshRequest = axios.post('/api/refresh', { refreshToken: this.refreshToken });
        }
        const { data } = await refreshRequest;
        window.console.log('INTERCEOTORS ON RESPONSE');
        if (data) this.constructor(data);
        const newRequest = { ...error.config, retry: true };
        return axios(newRequest);
      },
    );
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
        const { data } = await axios.post('/api/signup', {
          username: payload.email,
          password: payload.password,
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
        commit('setUser', new User(data));
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

    async logoutUser({ commit, getters }) {
      localStorage.removeItem('user-token');
      localStorage.removeItem('user-refreshToken');
      try {
        await axios.post('/api/logout', { refreshToken: getters.user.refreshToken });
        commit('setUser', null);
      } catch (e) {
        throw e;
      }
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
