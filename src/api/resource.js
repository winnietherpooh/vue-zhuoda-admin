import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnResourceList',
    method: 'get',
    params: query
  })
}

export function createResource(data) {
  return request({
    url: 'MnAddResource',
    method: 'post',
    data
  })
}

export function updateResource(data) {
  return request({
    url: 'MnUpdateResource',
    method: 'post',
    data
  })
}

export function deleteResource(data) {
  return request({
    url: 'MnDelResource',
    method: 'post',
    data
  })
}
