/*
 * @Author: your name
 * @Date: 2020-08-21 19:06:00
 * @LastEditTime: 2020-08-23 17:56:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\api\scan.js
 */
import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetScanList',
    method: 'get',
    params: query
  })
}

export function createMaster(data) {
  return request({
    url: 'MnAddMaster',
    method: 'post',
    data
  })
}

export function updateMaster(data) {
  return request({
    url: 'MnEditMaster',
    method: 'post',
    data
  })
}

export function getScanLogList(query) {
  return request({
    url: 'MnGetScanLogList',
    method: 'post',
    params: query
  })
}

export function deleteMaster(data) {
  return request({
    url: 'MnDelMaster',
    method: 'post',
    data
  })
}

export function deleteMasterAll(data) {
  return request({
    url: 'MnDelAllMaster',
    method: 'post',
    data
  })
}
