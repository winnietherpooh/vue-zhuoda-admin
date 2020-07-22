import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetGoodsList',
    method: 'get',
    params: query
  })
}

export function createMn(data) {
  return request({
    url: 'MnAddGoods',
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

export function getGoodsInfo(goodsId) {
  return request({
    url: 'MnGetGoodsInfo',
    method: 'get',
    params: { goodsId }
  })
}

export function getGoodsSpecialList(query) {
  return request({
    url: 'MnGetGoodsSpecialList',
    method: 'get',
    params: query
  })
}

