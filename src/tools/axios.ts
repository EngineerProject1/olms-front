import axiosRaw from 'axios'

const axios = axiosRaw.create({ baseURL: 'http://127.0.0.1:8090/api' })
axios.interceptors.request.use((request) => {
  request.headers['token'] = localStorage.getItem('token')
  return request
})

export default axios
