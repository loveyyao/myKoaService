const Sequelize = require('sequelize')
const { QueryTypes, Op } = require("sequelize")
const jsonwebtoken = require('jsonwebtoken')
const User = require('../sequelizeConfig').User
const Role = require('../sequelizeConfig').Role
const db = require('../sequelizeConfig').db
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
  const t = new Date().getTime() + ''
  const token = ctx.headers.authorization
  let info = null
  try {
    info = await verify(token)
  }
  catch (e) {
    info = null
    ctx.body = getResponse.error(e, '500', '获取用户信息失败')
  }
  if (!info) return
  // User.belongsTo(Role, { foreignKey: 'role_id', targetKey: 'id', as: 'role' + t.substring(t.length - 4) })
  // Role.hasMany(User, { foreignKey: { field: 'role_id', name: 'roleId', as: 'roleIdd' } })
  // TODO 返回格式不太完美
  /*
  *  "id": "c904dfe3-a204-4ead-b75d-5fbdff339645",
        "username": "admin",
        "realname": "管理员",
        "password": "123456",
        "avatar": null,
        "birthday": null,
        "sex": 0,
        "email": "320130049@qq.com",
        "phone": "13481812503",
        "roleId": "8ddb52f2-3b00-412b-8fc0-ec54a304a98d",
        "status": 1,
        "post": null,
        "delFlag": 0,
        "createBy": "系统",
        "createTime": "2021-08-07 17:45:38",
        "updateBy": null,
        "updateTime": null,
        "userIdentity": null,
        "role_id": "8ddb52f2-3b00-412b-8fc0-ec54a304a98d",
        "role": {
            "id": "8ddb52f2-3b00-412b-8fc0-ec54a304a98d",
            "name": "管理员",
            "code": "admin"
        }
  * */
  // await User.findOne({
  //   where: {
  //     del_flag: {
  //       [Op.eq]: '0'
  //     },
  //     id: {
  //       [Op.eq]: info.id
  //     }
  //   },
  //   include: [{
  //     model: Role,
  //     as: 'role' + t.substring(t.length - 4),
  //     where: {
  //       del_flag: {
  //         [Op.eq]: '0'
  //       }
  //     },
  //     required: false, // required: true强制一个INNER JOIN，用于required: false强制一个LEFT JOIN
  //     attributes: ['id', 'name', 'code']
  //   }]
  //   // raw: true
  // }).then(res => {
  //   ctx.body = getResponse.success(res)
  // }).catch(err => {
  //   ctx.body = getResponse.error(err)
  // })
  // 手动SQL
  const data = await db.query(`SELECT
	\`base_user\`.\`id\`,
	\`base_user\`.\`username\`,
	\`base_user\`.\`realname\`,
	\`base_user\`.\`password\`,
	\`base_user\`.\`avatar\`,
	\`base_user\`.\`birthday\`,
	\`base_user\`.\`sex\`,
	\`base_user\`.\`email\`,
	\`base_user\`.\`phone\`,
	\`base_user\`.\`status\`,
	\`base_user\`.\`post\`,
	\`base_user\`.\`del_flag\` AS \`delFlag\`,
	\`base_user\`.\`create_by\` AS \`createBy\`,
	\`base_user\`.\`create_time\` AS \`createTime\`,
	\`base_user\`.\`update_by\` AS \`updateBy\`,
	\`base_user\`.\`update_time\` AS \`updateTime\`,
	\`base_user\`.\`user_identity\` AS \`userIdentity\`,
	\`role\`.\`id\` AS \`roleId\`,
	\`role\`.\`name\` AS \`roleName\`,
	\`role\`.\`code\` AS \`roleCode\`
FROM
	\`base_user\` AS \`base_user\`
	left JOIN \`base_role\` AS \`role\` ON \`base_user\`.\`role_id\` = \`role\`.\`id\`
	AND \`role\`.\`del_flag\` = '0'
WHERE
	\`base_user\`.\`del_flag\` = '0'
	AND \`base_user\`.\`id\` = '${info.id}'
	LIMIT 1;`, { type: QueryTypes.SELECT })
  ctx.body = getResponse.success(data[0])
}

const addRole = async ctx => {
  const data = ctx.request.body
  const token = ctx.headers.authorization
  if (!data.roleId) {
    ctx.body = getResponse.error(null, 500, '角色不能为空')
    return
  }
  let userInfo = null
  try {
    userInfo = await verify(token)
  }
  catch (e) {
    userInfo = null
    ctx.body = getResponse.error(e)
  }
  if (!userInfo) return
  await User.update({
    roleId: data.roleId,
    updateBy: userInfo.name,
    updateTime: utils.time()
  }, {
    where: {
      id: {
        [Op.eq]: userInfo.id
      }
    }
  }).then(() => {
    ctx.body = getResponse.success(null)
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

module.exports = {
  ['POST user/login']: userLogin,
  ['GET user/info']: getUserInfo,
  ['POST user/addRole']: addRole
}
