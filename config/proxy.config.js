// 不能以斜杠结尾
const apiServer = process.env.VUE_APP_API_SERVER

module.exports = {
  '/deepexi-dashboard': {
    target: apiServer
  },
  '/spaas-enterprise-contact': {
    target: apiServer
  },
  '/spaas-global-application-center': {
    target: apiServer
  },
  '/deepexi-client-iam-sso': {
    target: apiServer
  }
}
