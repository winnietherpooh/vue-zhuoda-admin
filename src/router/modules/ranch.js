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
      path: 'ranchStaff',
      component: () => import('@/views/ranch/ranchStaff'),
      name: 'ranchStaff',
      meta: { title: 'ranchStaff', noCache: true }
    },
    {
      path: 'addRanch',
      component: () => import('@/views/ranch/addRanch'),
      name: 'addRanch',
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
