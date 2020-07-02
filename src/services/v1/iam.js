import axios from '../../utils/request'

const service = '/deepexi-staff-iam-sso'

const objToURLParams = obj =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${val}`)
    .join('&')

export async function login(params) {
  return axios.$post(`${service}/oauth/token`, objToURLParams(params)) // Content-Type = application/x-www-form-urlencoded
}
