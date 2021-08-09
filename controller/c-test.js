const Op = require('sequelize').Op
const Test = require('../sequelizeConfig').Test
const getResponse = require('../utils/response')
const utils = require('../utils/utils')
const validator = require('../validator')
const testRules = require('../validator/testRules')
const verify = require('../utils/token_verify')

// 分页查询 page页码 size分页大小
const selectTestPageList = async ctx => {
  const query = ctx.request.query
  const page = query.page
  const size = query.size
  // 校验参数
  const valid = validator(query, testRules.page)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  // 默认查询del_flag为0的，正常数据del_flag为1为已删除
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
  if (query.alias) {
    where.alias = {
      [Op.like]: `%${query.alias}%`
    }
  }
  await Test.findAndCountAll(
    {
      where,
      order: [
        ['create_time', 'DESC']
      ],
      offset: parseInt(page - 1),
      limit: parseInt(size)
    }).then(result => {
    ctx.body = getResponse.success({
      result: result.rows || [],
      total: result.count || 0
    })
  }).catch(err => {
    ctx.body = getResponse.error(err)
  })
}
// 新增 返回当前新增的数据
const addTest = async ctx => {
  const data = ctx.request.body
  const token = ctx.headers.authorization
  // 校验参数
  const valid = validator(data, testRules.add)
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
  const {
    name = null,
    code = null,
    alias = null,
    del_flag = '0',
    create_by = userInfo.name,
    create_time = utils.time(),
    update_by = null,
    update_time = null
  } = data
  await Test.create({
    name,
    code,
    alias,
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

// 删除
const delTest = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  let test = null
  try {
    test = await Test.findOne({
      where: {
        del_flag: {
          [Op.eq]: '0'
        },
        id: {
          [Op.eq]: query.id
        }
      }
    })
  } catch (e) {
    test = null
  }
  if (!test) {
    ctx.body = getResponse.error(null, 500, 'id不存在')
    return
  }
  await Test.update({
    del_flag: '1'
  }, {
    where: {
      id: query.id
    }
  }).then(res => {
    ctx.body = getResponse.success(res)
  }).catch(err => {
    ctx.body = getResponse.error(err, 500, '删除失败')
  })
}

// 获取
const getTestById = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  await Test.findOne({
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

const updateTest = async ctx => {
  const data = ctx.request.body
  const token = ctx.headers.authorization
  // 校验参数
  const valid = validator(data, testRules.edit)
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
  let test = null
  try {
    test = await Test.findOne({
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
    test = null
  }
  if (!test) {
    // 编辑的时候根据ID没有找到
    ctx.body = getResponse.error(null, 500, 'id不存在')
    return
  }
  await Test.update({
    name: data.name,
    code: data.code,
    alias: data.alias,
    update_by: userInfo.name,
    update_time: utils.time()
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

module.exports = {
  ['GET test/list']: selectTestPageList,
  ['POST test/add']: addTest,
  ['GET test/delete']: delTest,
  ['GET test/get']: getTestById,
  ['POST test/edit']: updateTest
}
