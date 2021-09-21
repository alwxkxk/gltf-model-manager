import axios from 'axios'

if (!process.env.REACT_APP_SERVER_URL) {
  console.error('请检查.env文件，是否含后端URL配置REACT_APP_SERVER_URL')
}
const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
  }
})

export default instance
