const loginRouter = {
  path: '/login',
  component: () => import('@/modules/login/views/index'),
  hidden: true
}

export default loginRouter
