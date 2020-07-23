import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetBannerList',
    method: 'get',
    params: query
  })
}

export function createMn(data) {
  return request({
    url: 'MnAddBanner',
    method: 'post',
    data
  })
}

export function updateMn(data) {
  return request({
    url: 'MnEditBanner',
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

export function setMn(data) {
  return request({
    url: 'MnSetMilker',
    method: 'post',
    data
  })
}
