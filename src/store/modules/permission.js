import { asyncRoutes, constantRoutes } from '@/router'
import { loadMicroApp } from 'qiankun'

const CACHE_APP_INDEX = 'CacheAppIndex'

let microAppInstance = null

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: [],
  applications: [],
  menus: [],
  get appIndex() {
    const index = sessionStorage.getItem(CACHE_APP_INDEX)
    return index !== undefined ? +index : 0
  },
  set appIndex(value) {
    sessionStorage.setItem(CACHE_APP_INDEX, value)
  }
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  },
  async GetApps({ commit }) {
    // TODO 请求APP列表
  },
  async GetMenu({ commit, getters }) {
    // TODO 请求菜单列表
  },
  loadMicroApp({ commit, state }) {
    const currApp = state.applications[state.appIndex]
    if (microAppInstance) {
      microAppInstance.unmount()
      microAppInstance = null
    }
    microAppInstance = loadMicroApp({
      name: currApp.name,
      entry: `/${currApp.code}/`,
      // entry: `http://localhost:8081`,
      container: '#frame',
      props: {
        user: state.user,
        token: state.token,
        app: currApp
      }
    })
    microAppInstance.mountPromise.then(() => {
      commit('Update', { isLoadingMicroApp: false })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
