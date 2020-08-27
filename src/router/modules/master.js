/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const masterRouter = {
  path: '/master',
  component: Layout,
  redirect: 'noRedirect',
  name: 'master',
  meta: {
    title: 'master',
    icon: 'el-icon-s-custom'
  },
  children: [
    {
      path: 'masterlist',
      component: () => import('@/views/master/masterlist'),
      name: 'masterlist',
      meta: { title: 'masterlist', noCache: true }
    }
    // {
    //   path: 'powerteam',
    //   component: () => import('@/views/master/powerteam'),
    //   name: 'powerteam',
    //   meta: { title: 'powerteam', noCache: true }
    // }
  ]
}

export default masterRouter
