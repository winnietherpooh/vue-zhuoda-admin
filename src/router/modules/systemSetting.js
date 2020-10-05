/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const systemSettingRouter = {
  path: '/systemSetting',
  component: Layout,
  redirect: 'noRedirect',
  name: 'systemSetting',
  meta: {
    title: 'systemSetting',
    icon: 'el-icon-s-tools'
  },
  children: [
    {
      path: 'masterlist',
      component: () => import('@/views/master/masterlist'),
      name: 'masterlist',
      meta: { title: 'masterlist', noCache: true }
    },
    {
      path: 'setting',
      component: () => import('@/views/systemSetting/setting'),
      name: 'setting',
      meta: { title: 'setting', noCache: true }
    }
  ]
}

export default systemSettingRouter
