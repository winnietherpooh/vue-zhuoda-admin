import request from '@/utils/request'

export function getData() {
  return request({
    url: 'Mnindex',
    method: 'get'
  })
}

export function getEchartsData() {
  return request({
    url: 'MnIndexEcharts',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/vue-element-admin/role/${id}`,
    method: 'delete'
  })
}
