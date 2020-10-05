/*
 * @Author: your name
 * @Date: 2020-08-20 19:55:49
 * @LastEditTime: 2020-10-05 08:20:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\router\modules\ranch.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const ranchRouter = {
  path: '/ranch',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ranch',
  meta: {
    title: 'ranch',
    icon: 'el-icon-menu'
  },
  children: [
    {
      path: 'ranchlist',
      component: () => import('@/views/ranch/ranchlist'),
      name: 'ranchlist',
      meta: { title: 'ranchlist', noCache: true }
    },
    {
      path: 'factorylist',
      component: () => import('@/views/ranch/factorylist'),
      name: 'factorylist',
      meta: { title: 'factorylist', noCache: true }
    },
    {
      path: 'ranchStaff',
      component: () => import('@/views/ranch/ranchStaff'),
      name: 'ranchStaff',
      meta: { title: 'ranchStaff', noCache: true }
    },
    {
      path: 'addRanch',
      component: () => import('@/views/ranch/addRanch'),
      name: 'addRanch',
      hidden: true,
      meta: { title: 'addRanch', noCache: true, activeMenu: '/ranch/ranchlist' }
    },
    {
      path: 'editRanch/:goodsId(\\d+)',
      component: () => import('@/views/ranch/editRanch'),
      name: 'editRanch',
      hidden: true,
      meta: { title: 'editRanch', noCache: true, activeMenu: '/ranch/ranchlist' }
    }
  ]
}

export default ranchRouter
