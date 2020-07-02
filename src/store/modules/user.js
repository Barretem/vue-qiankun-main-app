import Cookies from 'js-cookie'

import { getToken, setToken, removeToken } from '@/utils/auth'

import router, { resetRouter } from '@/router'
import { login } from '@/services/v1/spaas-console-api'

const state = {
  token: getToken(),
  userId: '',
  tenantId: '',
  username: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_TENANT_ID: (state, tenantId) => {
    state.tenantId = tenantId
  },
  SET_USER_NAME: (state, username) => {
    state.username = username
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      login(userInfo).then(response => {
        console.error(response)
        const { payload } = response
        const { userId, token, tenantId, username } = payload || {}
        commit('SET_USER_ID', userId)
        commit('SET_TOKEN', token)
        commit('SET_TENANT_ID', tenantId)
        commit('SET_USER_NAME', username)
        Cookies.set(payload.token, JSON.stringify({
          ...payload,
          roles: ['admin']
        }))
        setToken(payload.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const userInfo = Cookies.get(state.token)
      commit('SET_ROLES', ['admin'])
      if (userInfo) {
        resolve(JSON.parse(userInfo))
      } else {
        reject('登录状态过期，请重新登录！')
      }
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      Cookies.remove(state.token)
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resetRouter()

      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true })
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const roles = ['admin', 'developer', 'editor']

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
