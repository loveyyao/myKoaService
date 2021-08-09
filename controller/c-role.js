const Op = require('sequelize').Op
const Role = require('../sequelizeConfig').Role
const getResponse = require('../utils/response')
const utils = require('../utils/utils')
const validator = require('../validator')
const verify = require('../utils/token_verify')
const roleRules = require('../validator/roleRules')

// 分页查询角色
const selectRolePageList = async ctx => {
  const query = ctx.request.query
  const valid = validator(query, roleRules.page)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  const where = {
    del_flag: '0'
  }
  if (query.name) {
    where.name = {
      [Op.like]: `%${query.name}%`
    }
  }
  if (query.code) {
    where.code = {
      [Op.like]: `%${query.code}%`
    }
  }
  await Role.findAndCountAll({
    where,
    order: [
      ['create_time', 'DESC']
    ],
    offset: parseInt(query.page - 1),
    limit: parseInt(query.size)
  }).then(res => {
    ctx.body = getResponse.success({
      result: res.rows || [],
      total: res.count || 0
    })
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

module.exports = {
  ['GET role/list']: selectRolePageList
}
