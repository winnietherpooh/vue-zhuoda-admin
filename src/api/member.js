/*
 * @Author: your name
 * @Date: 2020-08-26 21:31:22
 * @LastEditTime: 2020-08-26 22:49:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\api\member.js
 */
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
    url: 'MnSetSubMessageWxMember',
    method: 'post',
    data
  })
}

export function getWxMember(query) {
  return request({
    url: 'MnWxMemberList',
    method: 'get',
    params: query
  })
}
