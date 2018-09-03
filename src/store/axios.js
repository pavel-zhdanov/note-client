import Axios from 'axios';

export default (user) => {
  const axios = Axios.create({
    baseURL: 'https://api.example.com',
  });
  axios.interceptors.request.use();
  return axios;
};
