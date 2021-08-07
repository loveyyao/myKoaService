module.exports = {
  login: {
    username: [
      {
        required: true,
        message: '用户名不能为空'
      }
    ],
    password: [
      {
        required: true,
        message: '密码不能为空'
      }
    ]
  }
}
