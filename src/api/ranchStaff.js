import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnAllRanchStaff',
    method: 'get',
    params: query
  })
}

export function getRanchSelect(query) {
  return request({
    url: 'MnGetAllRanchSelect',
    method: 'get',
    params: query
  })
}

export function getMember(query) {
  return request({
    url: 'MnStaffMemberList',
    method: 'get',
    params: query
  })
}

export function setMn(data) {
  return request({
    url: 'MnSetMilker',
    method: 'post',
    data
  })
}
