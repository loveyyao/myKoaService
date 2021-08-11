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
    // 角色名称
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // 角色编码
    code: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // 描述
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    delFlag: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '0',
      field: 'del_flag'
    },
    createBy: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: 'create_by'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'create_time'
    },
    updateBy: {
      type: DataTypes.STRING(32),
      allowNull: true,
      field: 'update_by'
    },
    updateTime: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'update_time'
    }
  }, {
    tableName: 'base_role',
    timestamps: false,
    underscored: true
  })
}
