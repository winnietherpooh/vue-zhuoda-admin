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

export function setOrderStatus(data) {
  return request({
    url: 'MnSetOrderStatus',
    method: 'post',
    data
  })
}

export function deleteMn(data) {
  return request({
    url: 'MnDeleteOrder',
    method: 'post',
    data
  })
}

export function deleteMnAll(data) {
  return request({
    url: 'MnDeleteAllOrder',
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
