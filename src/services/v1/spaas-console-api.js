/*
 * spaas-console接口
 * @author barret
 * @date 2019/06/03
 */
import { routers, userInfo } from '@/const/config'
import { POST, GET } from '../../utils/request'

const isSingleBuild = process.env.SINGLE_BUILD === '1'

const apiVersion = '/api/v1'
const serviceType = '/spaas-console-api'
const basicUrl = `${serviceType}${apiVersion}`

export const login = data =>
  isSingleBuild ? userInfo : POST(`${basicUrl}/users/login`, data)

// 根据appId获取左侧菜单
// eslint-disable-next-line import/prefer-default-export
export const getUserMenuTree = appId =>
  isSingleBuild ? routers : GET(`${basicUrl}/xpassPermission/userMenuTree/${appId}`)
