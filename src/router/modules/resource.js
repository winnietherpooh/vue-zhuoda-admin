/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const resourceRouter = {
  path: '/resource',
  component: Layout,
  redirect: 'noRedirect',
  name: 'resource',
  meta: {
    title: '资源管理',
    icon: 'el-icon-video-camera-solid'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/resource/index'),
      name: 'index',
      meta: { title: '资源列表', noCache: true }
    },
    {
      path: 'addresource',
      component: () => import('@/views/resource/addresource'),
      name: 'addresource',
      meta: { title: '上传资源', noCache: true }
    }
  ]
}

export default resourceRouter
