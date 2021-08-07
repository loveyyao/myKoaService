const controller = require('../controller')
const top = '/api/'

function addMapping(router, mapping) {
  for (let url in mapping) {
    if (url.startsWith('GET ')) {
      const path = top + url.substring(4)
      router.get(path, mapping[url])
    } else if (url.startsWith('POST ')) {
      const path = top + url.substring(5)
      router.post(path, mapping[url])
    }
  }
}

module.exports = function(dir) {
  let routers_dir = dir || 'controller',
    router = require('koa-router')()
  addMapping(router, controller)
  return router.routes()
};

