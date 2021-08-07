const Op = require('sequelize').Op
const Test = require('../sequelizeConfig').Tset
const getResponse = require('../utils/response')

const selectTestList = async ctx => {
  console.log(ctx.request.query)
  const query = ctx.request.query
  const data = getResponse()
  const where = {}
  if (query.name) {
    where.name = {
      [Op.like]: `%${query.name}%`
    }
  }
  await Test.findAll({ where }).then(result => {
    data.status = 200
    data.data = result
    data.msg = '操作成功'
    ctx.body = data
  }).catch(err => {
    data.status = 500
    data.data = err
    data.msg = '服务器异常'
    ctx.body = data
  })
}
const addTest = async ctx => {
  console.log(ctx.request.body)
  const data = ctx.request.body
}

module.exports = {
  ['GET test/list']: selectTestList,
  ['POST test/add']: addTest
}
