import axios from 'axios';

const instance = axios.create({
  baseURL: '/',
  timeout: 30000,
});

export default instance;
