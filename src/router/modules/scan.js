/*
 * @Author: your name
 * @Date: 2020-08-21 19:06:00
 * @LastEditTime: 2020-08-23 11:47:35
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\router\modules\scan.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const masterRouter = {
  path: '/scan',
  component: Layout,
  redirect: 'noRedirect',
  name: 'scan',
  meta: {
    title: 'scan',
    icon: 'el-icon-full-screen'
  },
  children: [
    {
      path: 'scanList',
      component: () => import('@/views/scanlog/scanList'),
      name: 'scanList',
      meta: { title: 'scanList', noCache: true }
    },
    {
      path: 'scanLogList',
      component: () => import('@/views/scanlog/scanLogList'),
      name: 'scanLogList',
      meta: { title: 'scanLogList', noCache: true }
    }
  ]
}

export default masterRouter
