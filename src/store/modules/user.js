import Cookies from 'js-cookie'

import { getToken, setToken, removeToken } from '@/utils/auth'

import { resetRouter } from '@/router'
import { login } from '@/services/v1/iam'

const state = {
  token: getToken(),
  userId: '',
  tenantId: '',
  username: '',
  avatar: '',
  roles: ['admin']
}

const mutations = {
  SET_TOKEN(state, { token, expires_in = 5 }) {
    const expires = new Date(Date.now() + (expires_in - 5) * 1000) // access_token 过期时间 客户端自减5s
    Cookies.set('token', token, { expires })
    setToken(token)
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
    Object.keys(userInfo).forEach(item => {
      state[item] = userInfo[item]
    })
  }
}

const actions = {
  // user login
  login({ dispatch }, { username, password, enterpriseCode }) {
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
        dispatch('REDUCE_LOGIN_DATA', payload)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  async Refresh({ commit, dispatch }, refresh_token) {
    console.log(999)
    const params = {
      grant_type: 'refresh_token',
      client_id: 'deepexi',
      client_secret: '123456',
      refresh_token
    }
    const { payload } = await login(params)
    dispatch('REDUCE_LOGIN_DATA', payload)
    return payload
  },

  // 从cookie中获取用户信息
  async GetUserInfoFromCookie({ commit }) {
    const userInfo = JSON.parse(Cookies.get('userInfo') || '{}')
    commit('SET_USER_INFO', userInfo)
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

  REDUCE_LOGIN_DATA({ commit }, payload) {
    const {
      access_token,
      refresh_token,
      userInfo,
      expires_in
    } = payload
    commit('SET_TOKEN', { token: access_token, expires_in })
    commit('SET_REFRESH_TOKEN', refresh_token)
    const userDetail = {
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
    }
    Cookies.set('userInfo', JSON.stringify(userDetail || {}))
    commit('SET_USER_INFO', userDetail)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
