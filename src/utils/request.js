import axios from 'axios'
import { Message } from 'element-ui'
import cookie from '@/utils/cookie'
import store from '@/store/index'

const LOGIN_API = '/deepexi-staff-iam-sso/oauth/token'
// 接口白名单
const whiteList = [LOGIN_API]

const remindOrExit = (() => {
  let timer
  return (error) => {
    const resp = error.response
    const { status } = resp

    if (status === 401) {
      Message.error('登陆超时，请重新登录！')
      if (timer) return
      timer = setTimeout(() => {
        store.dispatch('user/LOGOUT')
      }, 1200)
    } else if (status === 502) {
      Message.error('网关错误。')
    }
  }
})()

const service = {}

// Request helpers
const reqMethods = [
  'request',
  'delete',
  'get',
  'head',
  'options', // url, config
  'post',
  'put',
  'patch', // url, data, config
  '$get',
  '$put',
  '$delete',
  '$post'
]

const refreshToken = (() => {
  let running
  return async(refresh_token) => {
    if (!running) {
      running = new Promise((resolve, reject) => {
        store.dispatch('user/Refresh', refresh_token).then(() => {
          running = null
          resolve()
        }).catch((e) => {
          reject(e)
        })
      })
    }
    await running
  }
})()

axios.interceptors.request.use(
  async function(config) {
    // Do something before request is sent
    let url = config.url || ''
    const params = config.params || {}

    const userData = store.getters

    // 只传有值的参数
    const paramsList = ['tenantId', 'appId', 'username', 'userId'].filter((v) => {
      return params[v] === undefined && userData[v]
    })

    // query参数
    const queryData = paramsList
      .map((v) => {
        return `${v}=${userData[v]}`
      })
      .join('&')

    const isWhite = whiteList.indexOf(url) > -1
    const access_token = cookie.get('token')
    const refresh_token = cookie.get('refresh_token')
    // 验证是否先刷新token
    if (!isWhite && !access_token) {
      if (!refresh_token) store.dispatch('user/LOGOUT')
      await refreshToken(refresh_token)
    }

    const token = store.getters.token

    // jwt 验证
    // eslint-disable-next-line
    if (token) config.headers.common['Authorization'] = `Bearer ${token}`

    // 登录不走网关
    // eslint-disable-next-line
    // if (url.indexOf('deepexi-client-iam-sso') === -1) config.baseURL = '/deepexi-iam-gateway/'

    url += url.indexOf('?') > -1 ? '&' : '?' // 统一在url上加上特定参数
    url += queryData

    // eslint-disable-next-line
    config.url = `${url}${
      url.indexOf('?') > -1 ? '&' : '?'
    }_=${new Date().getTime()}`
    return config
  },
  function(error) {
    remindOrExit(error)
    // Do something with request error
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  function(resp) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    const { data } = resp
    const code = parseInt(data.code)
    // 如果code存在且不等于0，则将响应到error中
    if (code !== 0 && !Number.isNaN(code)) {
      // 如果httpStatusCode = 200, 但是操作失败的请求，将响应转为error
      // 兼容error的数据结构
      remindOrExit({ response: resp })
      return Promise.reject({ response: resp })
    }
    return Promise.resolve(resp)
  },
  function(error) {
    remindOrExit(error)
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response)
  }
)

reqMethods.forEach((method) => {
  service[method] = (...rest) => {
    // 对$开头的方法不做任何处理
    if (method.startsWith('$')) {
      return axios[method.replace('$', '')].apply(null, rest).then((res) => res.data)
    }
    return axios[method].apply(null, rest).then((res) => res)
  }
})

export const GET = service.$get
export const POST = service.$post
export const DELETE = service.$delete
export const PUT = service.$put

export default service
