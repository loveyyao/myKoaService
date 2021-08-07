const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  // 默认情况下sequelize.define会自动添加复数 S 须要自动提供表名 { tableName: 'base_test' }
  return sequelize.define('base_test', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false, // 是否为null
      primaryKey: true, // 主键
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    alias: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    del_flag: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    create_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    update_by: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    update_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
  }, {
    tableName: 'base_test',
    timestamps: false
  })
}
