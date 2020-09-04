/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const chartsRouter = {
  path: '/charts',
  component: Layout,
  redirect: 'noRedirect',
  name: 'resource',
  meta: {
    title: '销售统计',
    icon: 'el-icon-data-line'
  },
  children: [
    {
      path: 'chart',
      component: () => import('@/views/charts/chart'),
      name: 'chart',
      meta: { title: '销售统计', noCache: true }
    }
    // {
    //   path: 'test',
    //   component: () => import('@/views/charts/line'),
    //   name: 'test',
    //   meta: { title: '销售统计', noCache: true }
    // }
  ]
}

export default chartsRouter
