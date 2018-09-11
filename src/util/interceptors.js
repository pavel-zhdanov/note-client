import axios from 'axios';
import store from '../store/index';
import configFile from '../config';

const configAxios = () => {
  axios.defaults.baseURL = configFile.server;
  axios.interceptors.request.use(
    (config) => {
      const token = store.getters.token;
      if (!token) return config;
      const newConfig = { headers: {}, ...config };
      newConfig.headers.Authorization = `Bearer ${token}`;
      window.console.log('INTERCEPTOR ON REQUEST');
      return newConfig;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  axios.interceptors.response.use(
    resp => resp,
    async (error) => {
      const refreshToken = store.getters.refreshToken;
      if (!refreshToken ||
        error.response.status !== 401 ||
        error.config.retry) {
        throw error;
      }
      let refreshRequest;
      if (!refreshRequest) {
        refreshRequest = axios.post('/api/refresh', { refreshToken });
        window.console.log('AXIOS CONFIG');
        window.console.log(refreshToken);
      }
      const { data } = await refreshRequest;
      window.console.log('INTERCEPTORS ON RESPONSE');
      if (data) {
        window.console.log('AXIOS data');
        window.console.log(data);
        store.commit('updateTokens', data);
        localStorage.setItem('user-refreshToken', data.refreshToken);
        localStorage.setItem('user-token', data.token);
      }
      const newRequest = { ...error.config, retry: true };
      window.console.log(newRequest);
      return axios(newRequest);
    },
  );
};

export default configAxios;
