const Koa = require('koa')
// const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const config = require('./config/default')
const router = require('./router')

// 实例化
const app = new Koa()
// const router = new Router()
const bodyParser = new BodyParser()

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}`)
  await next()
})
app.use(bodyParser)
// Object.keys(routers).forEach((key) => {
//   router.use('/api/' + key, routers[key])
// })

// 配置路由
app.use(router())

app.listen(config.port, () => {
  console.log('应用已经启动，http://localhost:' + config.port)
})
