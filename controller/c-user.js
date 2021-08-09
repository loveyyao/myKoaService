const Op = require('sequelize').Op
const jsonwebtoken = require('jsonwebtoken')
const User = require('../sequelizeConfig').User
const getResponse = require('../utils/response')
const utils = require('../utils/utils')
const validator = require('../validator')
const userRules = require('../validator/userRules')
const config = require('../config/default')
const verify = require('../utils/token_verify')

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
    }, config.secret, { expiresIn: '24h' })
    ctx.body = getResponse.success(token, 200, '登录成功')
  })
}

const getUserInfo = async ctx => {
  const token = ctx.headers.authorization
  let info = null
  try {
    info = await verify(token)
  } catch (e) {
    info = null
    ctx.body = getResponse.error(e, '500', '获取用户信息失败')
  }
  if (!info) return
  await User.findOne({
    where: {
      del_flag: {
        [Op.eq]: '0'
      },
      id: {
        [Op.eq]: info.id
      }
    }
  }).then(res => {
    ctx.body = getResponse.success(res)
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

module.exports = {
  ['POST user/login']: userLogin,
  ['GET user/info']: getUserInfo
}
