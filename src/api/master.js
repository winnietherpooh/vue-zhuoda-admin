import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnMaster',
    method: 'get',
    params: query
  })
}

export function fetchArticle(id) {
  return request({
    url: '/vue-element-admin/article/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/article/pv',
    method: 'get',
    params: { pv }
  })
}

export function createMaster(data) {
  return request({
    url: 'MnAddMaster',
    method: 'post',
    data
  })
}

export function updateMaster(data) {
  return request({
    url: 'MnEditMaster',
    method: 'post',
    data
  })
}

export function getPowerList() {
  return request({
    url: 'MnPowerListApi',
    method: 'post'
  })
}

export function deleteMaster(data) {
  return request({
    url: 'MnDelMaster',
    method: 'post',
    data
  })
}
