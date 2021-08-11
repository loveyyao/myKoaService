import axios from 'axios'
import { Message } from 'element-ui'
import { ACCESS_TOKEN } from '@/utils/mutation-types'
import storage from 'store'

const request = axios.create({
  baseURL: '/ybs',
  timeout: 60 * 1000
})
const errorHandler = error => {
  Message.error('服务器异常')
  return Promise.reject(error)
}

request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, errorHandler)

request.interceptors.response.use(response => {
  const res = response.data
  if (res.success) {
    return res
  }
  Message.error(res.msg)
  return Promise.reject(res)
}, errorHandler)

export default request
