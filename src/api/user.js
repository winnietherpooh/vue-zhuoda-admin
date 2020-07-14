import request from '@/utils/request'

export function login(data) {
  return request({
    url: 'MnLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'MnGetUserInfo',
    method: 'get',
    headers: { AUTHORIZATION: token }
  })
}

export function logout() {
  return request({
    url: 'MnLoginOut',
    method: 'post'
  })
}
