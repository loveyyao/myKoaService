const Koa = require('koa')
const BodyParser = require('koa-bodyparser')
const config = require('./config/default')
const router = require('./router')
const koajwt = require('koa-jwt')

// 实例化
const app = new Koa()
// const router = new Router()
const bodyParser = new BodyParser()

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}`)
  await next().catch(err => {
    if (err.status === 401) {
      ctx.satus = 401
      ctx.body = {
        code: 401,
        success: false,
        data: err.data,
        msg: '登录过期'
      }
    } else {
      throw err
    }
  })
})

// 使用koajwt中间件
app.use(koajwt({ secret: config.secret }).unless({
  // 不需要校验token接口
  path: ['/api/user/login']
}))

app.use(bodyParser)

// 配置路由
app.use(router())

app.listen(config.port, () => {
  console.log('应用已经启动，http://localhost:' + config.port)
})
