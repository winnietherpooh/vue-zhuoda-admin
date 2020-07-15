import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnRanch',
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
