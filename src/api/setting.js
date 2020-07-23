import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: 'MnGetSetting',
    method: 'get',
    params: query
  })
}

export function updateMn(data) {
  return request({
    url: 'MnUpdateSettingAll',
    method: 'post',
    data
  })
}
