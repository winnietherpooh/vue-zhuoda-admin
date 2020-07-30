import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetOrderList',
    method: 'get',
    params: query
  })
}

export function getOrderInfo(orderId) {
  return request({
    url: 'MnGetOrderGoodsList',
    method: 'get',
    params: orderId
  })
}

export function repeatBuyerContent(data) {
  return request({
    url: 'MnRepeatBuyer',
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
