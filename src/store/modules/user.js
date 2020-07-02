import Cookies from 'js-cookie'

import { getToken, setToken, removeToken } from '@/utils/auth'

import router, { resetRouter } from '@/router'
import { login } from '@/services/v1/iam'

const state = {
  token: getToken(),
  userId: '',
  tenantId: '',
  username: '',
  avatar: '',
  roles: []
}

const mutations = {
  SET_TOKEN(state, { token, expires_in = 5 }) {
    const expires = new Date(Date.now() + (expires_in - 5) * 1000) // access_token 过期时间 客户端自减5s
    Cookies.set('token', token, { expires })
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_REFRESH_TOKEN(state, refresh_token) {
    Cookies.set('refresh_token', refresh_token)
    state.refresh_token = refresh_token
  },
  SET_USER_INFO(state, userInfo) {
    Cookies.set('userInfo', JSON.stringify(userInfo || {}))
    Object.keys(userInfo).forEach(item => {
      state[item] = userInfo[item]
    })
  },
  REDUCE_LOGIN_DATA(payload) {
    const {
      access_token,
      refresh_token,
      userInfo,
      expires_in
    } = payload
    this.SET_TOKEN({ token: access_token, expires_in })
    this.SET_REFRESH_TOKEN(refresh_token)
    this.SET_USER_INFO({
      tenantId: userInfo.tenantId, // 租户隔离标识
      userId: userInfo.userId, // 用户ID
      appId: '', // 应用id
      username: userInfo.username, // 帐号名
      email: '', // 邮箱
      phone: '', // 手机号
      nickname: '', // 姓名
      avatar: '', // 头像
      gender: '', // 性别（0：男，1：女）
      enterpriseCode: userInfo.enterpriseCode
    })
  }
}

const actions = {
  // user login
  login({ commit }, { username, password, enterpriseCode }) {
    return new Promise((resolve, reject) => {
      const userInfo = {
        grant_type: enterpriseCode,
        enterpriseCode,
        scope: 'all',
        client_id: 'deepexi',
        client_secret: '123456',
        username,
        password
      }
      console.error(userInfo)
      login(userInfo).then(response => {
        const { payload } = response
        commit('REDUCE_LOGIN_DATA', payload)
        setToken(payload.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  async Refresh({ commit }, refresh_token) {
    console.log(999)
    const params = {
      grant_type: 'refresh_token',
      client_id: 'deepexi',
      client_secret: '123456',
      refresh_token
    }
    const { payload } = await login(params)
    commit.dispatch('REDUCE_LOGIN_DATA', payload)
    return payload
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
