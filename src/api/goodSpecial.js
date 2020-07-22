import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetGoodsSpecialList',
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

export function getGoodsList(query) {
  return request({
    url: 'MnGetGoodsList',
    method: 'get',
    params: query
  })
}

export function addMn(data) {
  return request({
    url: 'MnAddGoodsSpecial',
    method: 'post',
    data
  })
}

export function updateMn(data) {
  return request({
    url: 'MnEditGoodsSpecial',
    method: 'post',
    data
  })
}

export function deleteMn(data) {
  return request({
    url: 'MnDelGoodsSpecial',
    method: 'post',
    data
  })
}

export function deleteStaffAll(data) {
  return request({
    url: 'MnDelAllStaffMember',
    method: 'post',
    data
  })
}

