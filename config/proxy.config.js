// 不能以斜杠结尾
const apiServer = process.env.VUE_APP_API_SERVER

const mockServer = 'http://39.98.50.163:3000/mock/995';
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

module.exports = {
  mock: {
    '/deepexi-dashboard': mockServer,
    '/spaas-enterprise-contact': mockServer,
    '/spaas-console-api': mockServer,
    '/spaas-global-application-center': apiServer
  },
  development: {
    '/deepexi-dashboard': {
      target: apiServer
    },
    '/spaas-enterprise-contact': {
      target: apiServer
    },
    '/spaas-global-application-center': {
      target: apiServer
    },
    '/deepexi-staff-iam-sso': {
      target: apiServer
    },
    [process.env.VUE_APP_BASE_API]: {
      target: `http://127.0.0.1:${port}/mock`,
      changeOrigin: true,
      pathRewrite: {
        ['^' + process.env.VUE_APP_BASE_API]: ''
      }
    }
  }
}
