/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'goods',
  meta: {
    title: 'goods',
    icon: 'chart'
  },
  children: [
    {
      path: 'goodsList',
      component: () => import('@/views/goods/goodsList'),
      name: 'goodsList',
      meta: { title: 'goodsList', noCache: true }
    },
    {
      path: 'addGoods',
      component: () => import('@/views/goods/addGoods'),
      name: 'addGoods',
      meta: { title: 'addGoods', noCache: true }
    },
    {
      path: 'orderList',
      component: () => import('@/views/goods/orderList'),
      name: 'orderList',
      meta: { title: 'orderList', noCache: true }
    }
  ]
}

export default goodsRouter
