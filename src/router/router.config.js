/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "Home" */ '@/views/home/index'),
    meta: {
      title: '金安环保'
    }
  },
  {
    path: '/richtext',
    name: 'Richtext',
    component: () => import(/* webpackChunkName: "AddressEdit" */ '@/views/richtext/index')
  },
  {
    path: '/address',
    name: 'Address',
    component: () => import(/* webpackChunkName: "Address" */ '@/views/address/index'),
    meta: {
      title: '地址管理'
    }
  },
  {
    path: '/address-add',
    name: 'AddressAdd',
    component: () => import(/* webpackChunkName: "AddressAdd" */ '@/views/address/add'),
    meta: {
      title: '新增地址'
    }
  },
  {
    path: '/address-edit',
    name: 'AddressEdit',
    component: () => import(/* webpackChunkName: "AddressEdit" */ '@/views/address/add'),
    meta: {
      title: '编辑地址'
    }
  },
  {
    path: '/online',
    name: 'Online',
    component: () => import(/* webpackChunkName: "Online" */ '@/views/online/index'),
    meta: {
      keepAlive: true
    }
  }
]
