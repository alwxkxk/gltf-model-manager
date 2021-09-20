import axios from 'axios'

const instance = axios.create({
    baseURL: "http://127.0.0.1:8080",
    withCredentials: false,
    headers: {
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      }
  });

export default instance