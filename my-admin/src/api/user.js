import axios from '@/utils/request'

export const login = (data) => {
  return axios({
    url: 'api/user/login',
    method: 'post',
    data
  })
}
