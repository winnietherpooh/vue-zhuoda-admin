/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const memberRouter = {
  path: '/member',
  component: Layout,
  redirect: 'noRedirect',
  name: 'member',
  meta: {
    title: 'member',
    icon: 'chart'
  },
  children: [
    {
      path: 'memberIndex:ranchId',
      component: () => import('@/views/member/memberIndex'),
      name: 'memberIndex',
      meta: { title: 'memberIndex', noCache: true }
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
