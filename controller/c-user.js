const Op = require('sequelize').Op
const jsonwebtoken = require('jsonwebtoken')
const User = require('../sequelizeConfig').User
const getResponse = require('../utils/response')
const utils = require('../utils/utils')
const validator = require('../validator')
const userRules = require('../validator/userRules')
const config = require('../config/default')

const userLogin = async ctx => {
  const data = ctx.request.body
  const valid = validator(data, userRules.login)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  const where = {
    del_flag: '0',
    username: {
      [Op.eq]: data.username
    }
  }
  await User.findAll({
    where
  }).then(res => {
    const user = res[0] || null
    if (!user) {
      ctx.body = getResponse.error(null, 500, '用户不存在')
      return
    }
    if (user.password !== data.password) {
      ctx.body = getResponse.error(null, 500, '密码错误')
      return
    }
    // 签发token
    const token = jsonwebtoken.sign({
      name: user.username,
      id: user.id
    }, config.secret, { expiresIn: '1h' })
    ctx.body = getResponse.success(token, 200, '登录成功')
  })
}

module.exports = {
  ['POST user/login']: userLogin
}
