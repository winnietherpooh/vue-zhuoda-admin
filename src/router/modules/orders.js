/*
 * @Author: your name
 * @Date: 2020-08-14 15:12:13
 * @LastEditTime: 2020-10-05 08:32:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\router\modules\goods.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const ordersRouter = {
  path: '/orders',
  component: Layout,
  redirect: 'noRedirect',
  name: 'orders',
  meta: {
    title: 'orders',
    icon: 'el-icon-s-goods'
  },
  children: [
    {
      path: 'orderList/:orderId?',
      component: () => import('@/views/goods/orderList'),
      name: 'orderList',
      meta: { title: 'orderList', noCache: true }
    },
    {
      path: 'goodsEvaluate',
      component: () => import('@/views/goods/goodsEvaluate'),
      name: 'goodsEvaluate',
      meta: { title: 'goodsEvaluate', noCache: true }
    },
    {
      path: 'orderReturn/:orderId?',
      component: () => import('@/views/goods/orderReturn'),
      name: 'orderReturn',
      meta: { title: 'orderReturn', noCache: true }
    }
  ]
}

export default ordersRouter
