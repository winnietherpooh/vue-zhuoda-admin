import request from '@/utils/request'

export function getData(query) {
  return request({
    url: 'MnGetStatisticalData',
    method: 'post',
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

export function deleteResourceAll(data) {
  return request({
    url: 'MnDelResourceAll',
    method: 'post',
    data
  })
}
