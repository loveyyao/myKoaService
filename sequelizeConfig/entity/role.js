const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('base_role', {
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
      allowNull: false
    },
    // 密码
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    del_flag: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '0'
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
    }
  }, {
    tableName: 'base_role',
    timestamps: false
  })
}
