import request from '@/utils/request'

export function getToken() {
  return request({
    url: 'MnResourceGetToken',
    method: 'get'
  })
}
