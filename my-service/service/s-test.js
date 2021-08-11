const Op = require('sequelize').Op
const Test = require('../sequelizeConfig').Test
const utils = require('../utils/utils')
const getResponse = require('../utils/response')

const selectTestPageList = async (params) => {
  const where = {
    delFlag: {
      [Op.eq]: '0'
    }
  }
  if (params.name) {
    where.name = {
      [Op.like]: `%${params.name}%`
    }
  }
  if (params.code) {
    where.code = {
      [Op.like]: `%${params.code}%`
    }
  }
  if (params.alias) {
    where.alias = {
      [Op.like]: `%${params.alias}%`
    }
  }
  let result = null
  try {
    const res = await Test.findAndCountAll({
      where,
      order: [['create_time', 'DESC']],
      offset: parseInt(params.page - 1),
      limit: parseInt(params.size)
    })
    result = getResponse.success({
      result: res.rows || [],
      total: res.count || 0
    })
  } catch (e) {
    result = getResponse.error(e)
  }
  return result
}

const addTest = async (data, user) => {
  const {
    name = null,
    code = null,
    alias = null,
    del_flag = '0',
    create_by = user.name,
    create_time = utils.time(),
    update_by = null,
    update_time = null
  } = data
  let result = null
  try {
    const res = await Test.create({
      name,
      code,
      alias,
      del_flag,
      create_by,
      create_time,
      update_by,
      update_time
    })
    result = getResponse.success(res)
  } catch (e) {
    result = getResponse.error(e)
  }
  return result
}

const delTest = async (id) => {
  const data = await getTestById(id)
  if (!data.success) {
    return data
  }
  if (!data.data) {
    return getResponse.error(null, 500, 'id不存在')
  }
  let result = null
  try {
    const res = await Test.update({
      delFlag: '1'
    }, {
      where: {
        id: {
          [Op.eq]: id
        }
      }
    })
    result = getResponse.success(res)
  } catch (e) {
    result = getResponse.error(e)
  }
  return result
}

const getTestById = async (id) => {
  let result = null
  try {
    const res = await Test.findOne({
      where: {
        del_flag: {
          [Op.eq]: '0'
        },
        id: {
          [Op.eq]: id
        }
      }
    })
    result = getResponse.success(res)
  } catch (e) {
    result = getResponse.error(e)
  }
  return result
}

const updateTest = async (params, user) => {
  const data = await getTestById(params.id)
  if (!data.success) {
    return data
  }
  if (!data.data) {
    return getResponse.error(null, 500, 'id不存在')
  }
  let result = null
  try {
    const res = await Test.update({
      name: params.name,
      code: params.code,
      alias: params.alias,
      updateBy: user.name,
      updateTime: utils.time()
    }, {
      where: {
        id: {
          [Op.eq]: params.id
        }
      }
    })
    result = getResponse.success(res)
  } catch (e) {
    result = getResponse.error(e)
  }
  return result
}

module.exports = {
  selectTestPageList,
  addTest,
  delTest,
  getTestById,
  updateTest
}
