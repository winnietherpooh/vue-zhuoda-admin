import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnRanch',
    method: 'get',
    params: query
  })
}

export function getRanchInfo(ranchId) {
  return request({
    url: 'MnGetRanchInfo',
    method: 'get',
    params: { ranchId }
  })
}

export function createMn(data) {
  return request({
    url: 'MnEditRanch',
    method: 'post',
    data
  })
}

export function createRanch(data) {
  return request({
    url: 'MnAddRanch',
    method: 'post',
    data
  })
}

export function updateRanch(data) {
  return request({
    url: 'MnEditRanch',
    method: 'post',
    data
  })
}

export function deleteRanch(data) {
  return request({
    url: 'MnDelRanch',
    method: 'post',
    data
  })
}

export function deleteRanchAll(data) {
  return request({
    url: 'MnDelAllRanch',
    method: 'post',
    data
  })
}
