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
    }
  ]
}

export default masterRouter
