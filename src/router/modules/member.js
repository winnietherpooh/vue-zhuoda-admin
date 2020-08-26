/*
 * @Author: your name
 * @Date: 2020-08-14 15:12:13
 * @LastEditTime: 2020-08-26 22:43:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\router\modules\member.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: 'noRedirect',
  name: 'member',
  meta: {
    title: 'member',
    icon: 'el-icon-user-solid'
  },
  children: [
    {
      path: 'memberIndex',
      component: () => import('@/views/member/memberIndex'),
      name: 'memberIndex',
      meta: { title: 'memberIndex', noCache: true }
    },
    {
      path: 'wxMemberIndex',
      component: () => import('@/views/member/wxMemberIndex'),
      name: 'wxMemberIndex',
      meta: { title: 'wxMemberIndex', noCache: true }
    }
    // {
    //   path: 'line',
    //   component: () => import('@/views/charts/line'),
    //   name: 'LineChart',
    //   meta: { title: 'lineChart', noCache: true }
    // }
  ]
}

export default memberRouter
