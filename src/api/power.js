import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnPowerList',
    method: 'get',
    params: query
  })
}

export function createPowerTeam(data) {
  return request({
    url: 'MnAddPower',
    method: 'post',
    data
  })
}

export function updatePowerTeam(data) {
  return request({
    url: 'MnEditPowerTeam',
    method: 'post',
    data
  })
}

export function getPowerList() {
  return request({
    url: 'MnPowerListApi',
    method: 'post'
  })
}

export function deletePowerTeam(data) {
  return request({
    url: 'MnDelPower',
    method: 'post',
    data
  })
}
