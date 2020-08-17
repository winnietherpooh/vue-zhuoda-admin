/*
 * @Author: your name
 * @Date: 2020-08-14 15:12:13
 * @LastEditTime: 2020-08-16 22:24:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\api\goods.js
 */
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
    url: 'MnDelGoodsList',
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

export function getCityData(query) {
  return request({
    url: 'MnGetAllCityList',
    method: 'get',
    params: query
  })
}

export function setCityPostAgeData(query) {
  return request({
    url: 'MnSetCityPostAge',
    method: 'get',
    params: query
  })
}

export function getEList(query) {
  return request({
    url: 'MnGetGoodsEvaluateList',
    method: 'get',
    params: query
  })
}

export function deleteMnE(data) {
  return request({
    url: 'MnDeleteEvaluate',
    method: 'post',
    data
  })
}

export function deleteMnAllE(data) {
  return request({
    url: 'MnDeleteEvaluateAll',
    method: 'post',
    data
  })
}

export function hiddenMn(data) {
  return request({
    url: 'MnHiddenEvaluate',
    method: 'post',
    data
  })
}

export function replayE(data) {
  return request({
    url: 'MnReplyEvaluate',
    method: 'post',
    data
  })
}
