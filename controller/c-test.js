const Op = require('sequelize').Op
const Test = require('../sequelizeConfig').Tset
const getResponse = require('../utils/response')
const utlis = require('../utils/utils')

// 分页查询 page页码 size分页大小
const selectTestList = async ctx => {
  const query = ctx.request.query
  const page = query.page
  const size = query.size
  if (!page) {
    ctx.body = getResponse.error(null, 500, 'page不能为空')
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
  const {
    name = null,
    code = null,
    alias = null,
    del_flag = '0',
    create_by = 'admin',
    create_time = utlis.time(),
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

module.exports = {
  ['GET test/list']: selectTestList,
  ['POST test/add']: addTest
}
