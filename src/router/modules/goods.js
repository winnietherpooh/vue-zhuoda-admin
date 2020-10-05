/*
 * @Author: your name
 * @Date: 2020-08-14 15:12:13
 * @LastEditTime: 2020-10-05 08:35:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \admin\src\router\modules\goods.js
 */
/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const goodsRouter = {
  path: '/goods',
  component: Layout,
  redirect: 'noRedirect',
  name: 'goods',
  meta: {
    title: 'goods',
    icon: 'el-icon-s-goods'
  },
  children: [
    {
      path: 'index',
      component: () => import('@/views/resource/index'),
      name: 'index',
      meta: { title: '资源列表', noCache: true }
    },
    {
      path: 'bannerList',
      component: () => import('@/views/systemSetting/bannerList'),
      name: 'bannerList',
      meta: { title: 'bannerList', noCache: true }
    },
    {
      path: 'indexVideo',
      component: () => import('@/views/systemSetting/indexVideo'),
      name: 'indexVideo',
      meta: { title: 'indexVideo', noCache: true }
    },
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
      hidden: true,
      meta: { title: 'addGoods', noCache: true, activeMenu: '/goods/goodsList' }
    },
    {
      path: 'editGoods/:goodsId(\\d+)',
      component: () => import('@/views/goods/editGoods'),
      name: 'editGoods',
      hidden: true,
      meta: { title: 'editGoods', noCache: true, activeMenu: '/goods/goodsList' }
    },
    {
      path: 'specialList',
      component: () => import('@/views/goods/specialList'),
      name: 'specialList',
      meta: { title: 'specialList', noCache: true }
    },
    {
      path: 'goodsFreight',
      component: () => import('@/views/goods/goodsFreight'),
      name: 'goodsFreight',
      meta: { title: 'goodsFreight', noCache: true }
    },
    {
      path: 'indexVideoBarrage/:videoId(\\d+)',
      component: () => import('@/views/systemSetting/indexVideoBarrage'),
      name: 'indexVideoBarrage',
      hidden: true,
      meta: { title: 'indexVideoBarrage', noCache: true, activeMenu: '/goods/indexVideo' }
    }
  ]
}

export default goodsRouter
