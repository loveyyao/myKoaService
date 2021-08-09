const Sequelize = require('sequelize')
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('base_user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false, // 是否为null
      primaryKey: true, // 主键
      autoIncrement: true
    },
    // 登录账号
    username: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // 真实姓名
    realname: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // 密码
    password: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    // 头像
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    // 生日
    birthday: {
      type: DataTypes.DATE,
      allowNull: true
    },
    // 性别 0未知 1男 2女
    sex: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    // 邮箱
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    // 电话
    phone: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'role_id'
    },
    // 状态 1正常 2 冻结
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    // 职务
    post: {
      type: DataTypes.STRING(32),
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
    },
    // 身份（1普通成员 2上级）
    userIdentity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      field: 'user_identity'
    }
  }, {
    tableName: 'base_user',
    timestamps: false,
    underscored: true
  })
}
