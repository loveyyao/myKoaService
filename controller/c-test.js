const getResponse = require('../utils/response')
const validator = require('../validator')
const testRules = require('../validator/testRules')
const verify = require('../utils/token_verify')
const testService = require('../service/s-test')

// 分页查询 page页码 size分页大小
const selectTestPageList = async ctx => {
  const query = ctx.request.query
  // 校验参数
  const valid = validator(query, testRules.page)
  if (valid.length) {
    ctx.body = getResponse.error(null, 500, valid[0].message)
    return
  }
  ctx.body = await testService.selectTestPageList(query)
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
  ctx.body = testService.addTest(data, userInfo)
}

// 删除
const delTest = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  ctx.body = await testService.delTest(query.id)
}

// 获取
const getTestById = async ctx => {
  const query = ctx.request.query
  if (!query.id) {
    ctx.body = getResponse.error(null, 500, 'id不能为空')
    return
  }
  ctx.body = await testService.getTestById(query.id)
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
  ctx.body = await testService.updateTest(data, userInfo)
}

module.exports = {
  ['GET test/list']: selectTestPageList,
  ['POST test/add']: addTest,
  ['GET test/delete']: delTest,
  ['GET test/get']: getTestById,
  ['POST test/edit']: updateTest
}
