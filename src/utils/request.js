import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  params: {
    tenantId: '',
    userId: '',
    _: new Date().getTime()
  }
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    return response.data
  },
  error => {
    const { msg, code } = error.response.data || {}
    Notification({
      title: code,
      message: msg,
      type: 'error'
    })
    return Promise.reject(error)
  }
)

export const GET = (url, params) => {
  return service({
    url,
    method: 'get',
    params
  })
}

export const POST = (url, data) => {
  return service({
    url,
    method: 'post',
    data
  })
}

export const DELETE = (url, data) => {
  return service({
    url,
    method: 'delete',
    data
  })
}

export const PUT = (url, data) => {
  return service({
    url,
    method: 'put',
    data
  })
}

export default service
