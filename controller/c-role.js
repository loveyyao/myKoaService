const Op = require('sequelize').Op
const Role = require('../sequelizeConfig').Role
const User = require('../sequelizeConfig').User
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

// 新增角色
const addRole = async ctx => {
  const data = ctx.request.body
  const token = ctx.headers.authorization
  // 校验参数
  const valid = validator(data, roleRules.add)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  // 根据token获取用户信息{ name: username, id: id }
  let userInfo = null
  try {
    userInfo = await verify(token)
  } catch (e) {
    userInfo = null
    ctx.body = getResponse.error(e)
  }
  if (!userInfo) return
  let role = null
  try {
    role = await Role.findOne({
      where: {
        del_flag: {
          [Op.eq]: '0'
        },
        code: {
          [Op.eq]: data.code
        }
      }
    })
  } catch (e) {
    role = null
  }
  if (role) {
    ctx.body = getResponse.error(null, 500, `${data.code}编码重复`)
    return
  }
  const {
    name = null,
    code = null,
    description = null,
    del_flag = '0',
    create_by = userInfo.name,
    create_time = utils.time(),
    update_by = null,
    update_time = null
  } = data
  await Role.create({
    name,
    code,
    description,
    del_flag,
    create_by,
    create_time,
    update_by,
    update_time
  }).then(res => {
    ctx.body = getResponse.success(res)
  }).catch(err => {
    ctx.body = getResponse.error(err, 500, '添加失败')
  })
}

// 编辑角色
const updateRole = async ctx => {
  const data = ctx.request.body
  const token = ctx.headers.authorization
  const valid = validator(data, roleRules.edit)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  let userInfo = null
  try {
    userInfo = await verify(token)
  } catch (e) {
    userInfo = null
    ctx.body = getResponse.error(e)
  }
  if (!userInfo) return
  let role = null
  try {
    role = await Role.findOne({
      where: {
        del_flag: {
          [Op.eq]: '0'
        },
        id: {
          [Op.eq]: data.id
        }
      }
    })
  } catch (e) {
    role = null
  }
  if (!role) {
    ctx.body = getResponse.error(null, 500, 'id不存在')
    return
  }
  await Role.update({
    name: data.name,
    description: data.description || role.description,
    updateBy: userInfo.name,
    updateTime: utils.time()
  }, {
    where: {
      id: {
        [Op.eq]: data.id
      }
    }
  }).then(() => {
    ctx.body = getResponse.success(data.id)
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

// 获取角色根据ID
const getRoleById = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  await Role.findOne({
    where: {
      del_flag: {
        [Op.eq]: '0'
      },
      id: {
        [Op.eq]: query.id
      }
    }
  }).then(res => {
    ctx.body = getResponse.success(res)
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

// 删除角色
const deleteRole = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  let user = null
  try {
    user = await User.findOne({
      where: {
        del_flag: {
          [Op.eq]: '0'
        },
        role_id: {
          [Op.eq]: query.id
        }
      }
    })
  } catch (e) {
    user = null
    ctx.body = getResponse.error(err)
    return
  }
  if (user) {
    ctx.body = getResponse.error(null, 500, '该角色与用户关联，不能删除')
    return
  }
  await Role.update({
    delFlag: '1'
  }, {
    where: {
      id: query.id
    }
  }).then((res) => {
    ctx.body = getResponse.success(res)
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}

module.exports = {
  ['GET role/list']: selectRolePageList,
  ['POST role/add']: addRole,
  ['POST role/edit']: updateRole,
  ['GET role/get']: getRoleById,
  ['GET role/delete']: deleteRole
}
