/* eslint-disable dot-notation,consistent-return */
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3001/';

class User {
  constructor(data) {
    window.console.log('CREATE USER');
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.id = data.id;
    this.email = data.username;
    this.nickname = data.nickname;
    this.avatarSrc = data.avatarSrc;
    localStorage.setItem('user-refreshToken', data.refreshToken);
    localStorage.setItem('user-token', data.token);
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
        window.console.log('INTERCEPTORS ON RESPONSE');
        if (data) {
          this.token = data.token;
          this.refreshToken = data.refreshToken;
          localStorage.setItem('user-refreshToken', data.refreshToken);
          localStorage.setItem('user-token', data.token);
        }
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
    updateUser(state, payload) {
      state.user.nickname = payload.nickname;
      state.user.avatarSrc = payload.avatarSrc;
      state.user.email = payload.username;
      state.user.id = payload.id;
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
        const { data } = await axios.get('/api/user');
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
    isUserLoggedIn(state) {
      return state.user !== null;
    },
  },
};
