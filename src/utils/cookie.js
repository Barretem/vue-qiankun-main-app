import jsCookie from 'js-cookie'

const cookieDomain = process.env.VUE_APP_COOKIE_DOMAIN
const cookiePath = process.env.VUE_APP_COOKIE_PATH
const cookieParams = {
  path: cookiePath,
  domain: cookieDomain
}

const cookie = {
  ...jsCookie,
  set: (key, value, options = {}) => {
    return jsCookie.set(key, value, {
      ...cookieParams,
      ...options
    })
  }
}

export default cookie
