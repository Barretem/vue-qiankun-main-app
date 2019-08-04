import axios from '@/services/apiClient'

const apiVersion = '/api/v1'
const serviceType = '/spaas-global-application-center'
const basicUrl = `${serviceType}${apiVersion}`

/**
 * @description 应用中心-应用列表
 */
// eslint-disable-next-line import/prefer-default-export
export const appOptions = centerId =>
  axios.$get(`${basicUrl}/app/infos?page=-1&status=1&centerId=${centerId}`)
