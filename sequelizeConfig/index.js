const Sequelize = require('sequelize')
const config = require('../config/default')

const sequelize = new Sequelize(config.database.DATABASE, config.database.USERNAME, config.database.PASSWORD, {
  host: config.database.HOST,
  dialect: 'mysql',
  // 连接池
  // pool: {
  //   max: 5,
  //   min: 0,
  //   idle: 100000
  // }
  define: {
    timestamps: false //关闭时间戳
  }
})
sequelize.authenticate().then(() => {
  console.log('数据库链接成功')
}).catch(err => {
  console.log('数据库链接失败', err)
})

module.exports = {
  db: sequelize,
  Tset: require('./entity/test')(sequelize, Sequelize)
}
