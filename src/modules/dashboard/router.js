import Layout from '@/layout'

const dashboardRouter = {
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  children: [
    {
      path: 'dashboard',
      component: () => import('@/modules/dashboard/views/index/index'),
      hidden: true,
      meta: { title: '首页', icon: 'dashboard', affix: true }
    }
  ]
}

export default dashboardRouter
