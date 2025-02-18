import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetIndexVideoList',
    method: 'get',
    params: query
  })
}

export function createMn(data) {
  return request({
    url: 'MnAddIndexVideo',
    method: 'post',
    data
  })
}

export function updateMn(data) {
  return request({
    url: 'MnEditIndexVideo',
    method: 'post',
    data
  })
}

export function deleteMn(data) {
  return request({
    url: 'MnDelBanner',
    method: 'post',
    data
  })
}

export function deleteMnAll(data) {
  return request({
    url: 'MnDelAllBanner',
    method: 'post',
    data
  })
}

export function getIndexBanList(query) {
  return request({
    url: 'MnGetVideoBarrageList',
    method: 'get',
    params: query
  })
}

export function deleteB(data) {
  return request({
    url: 'MnDeleteBarrage',
    method: 'post',
    data
  })
}

export function updateB(data) {
  return request({
    url: 'MnEditBarrage',
    method: 'post',
    data
  })
}
