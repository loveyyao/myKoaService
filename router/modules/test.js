const Router = require('koa-router')
const testServices = require('../../mysqlModules/test')
const getResponse = require('../../utils/response')
const router = new Router()

router.get('/list', async ctx => {
  const data = getResponse()
  try {
    const result = await testServices.findTestData('test')
    data.status = 200
    data.data = result
  } catch (e) {
    data.status = 500
    data.data = e
    data.msg = '服务器异常'
  }
  ctx.body = data
})

module.exports = router.routes()
