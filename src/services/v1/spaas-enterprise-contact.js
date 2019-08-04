import { userInfo } from '@/const/config'
import { GET } from '../../utils/request'

const isSingleBuild = process.env.SINGLE_BUILD === '1'

const apiVersion = '/api/v1'
const enterpriseContact = `/spaas-enterprise-contact${apiVersion}`

// 获取头部导航栏thirdId
export const adminUser = tenantId =>
  isSingleBuild
    ? userInfo
    : GET(`${enterpriseContact}/users/adminUser`, {
      params: { tenantId }
    })
