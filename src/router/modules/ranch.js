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
    }
  ]
}

export default ranchRouter
