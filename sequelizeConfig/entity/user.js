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
    // 状态 1正常 2 冻结
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    del_flag: {
      type: DataTypes.STRING(1),
      allowNull: false,
      defaultValue: '0'
    },
    // 职务
    post: {
      type: DataTypes.STRING(32),
      allowNull: true
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
    // 身份（1普通成员 2上级）
    user_identity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'base_user',
    timestamps: false
  })
}
