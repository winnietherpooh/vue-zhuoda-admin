/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const ranchRouter = {
  path: '/ranch',
  component: Layout,
  redirect: 'noRedirect',
  name: 'ranch',
  meta: {
    title: 'ranch',
    icon: 'chart'
  },
  children: [
    {
      path: 'ranchlist',
      component: () => import('@/views/ranch/ranchlist'),
      name: 'ranchlist',
      meta: { title: 'ranchlist', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/charts/line'),
      name: 'LineChart',
      meta: { title: 'lineChart', noCache: true }
    }
  ]
}

export default ranchRouter
