import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnMemberList',
    method: 'get',
    params: query
  })
}

export function createMn(data) {
  return request({
    url: 'MnAddMember',
    method: 'post',
    data
  })
}

export function updateMn(data) {
  return request({
    url: 'MnEditMember',
    method: 'post',
    data
  })
}

export function deleteMn(data) {
  return request({
    url: 'MnDelMember',
    method: 'post',
    data
  })
}

export function deleteMnAll(data) {
  return request({
    url: 'MnDelAllMember',
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
