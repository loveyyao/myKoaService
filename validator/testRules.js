module.exports = {
  add: {
    name: [
      {
        required: true,
        message: '名称不能为空'
      },
      {
        min: 2,
        max: 30,
        message: '名称长度不能小于2位数且不能超过30位数'
      }
    ],
    code: [
      {
        required: true,
        message: '编码不能为空'
      },
      {
        min: 2,
        max: 30,
        message: '编码长度不能小于2位数且不能超过30位数'
      },
      {
        validator: (value) => {
          const reg = /[\u4E00-\u9FA5]/g
          if (reg.test(value)) {
            return {
              message: '编码格式不能存在中文',
              valid: false
            }
          }
          return {
            valid: true
          }
        }
      }
    ]
  },
  edit: {
    id: [
      {
        required: true,
        message: 'id不能为空'
      }
    ],
    name: [
      {
        required: true,
        message: '名称不能为空'
      },
      {
        min: 2,
        max: 30,
        message: '名称长度不能小于2位数且不能超过30位数'
      }
    ],
    code: [
      {
        required: true,
        message: '编码不能为空'
      },
      {
        min: 2,
        max: 30,
        message: '编码长度不能小于2位数且不能超过30位数'
      },
      {
        validator: (value) => {
          const reg = /[\u4E00-\u9FA5]/g
          if (reg.test(value)) {
            return {
              message: '编码格式不能存在中文',
              valid: false
            }
          }
          return {
            valid: true
          }
        }
      }
    ]
  },
  page: {
    page: [
      {
        required: true,
        message: 'page不能为空'
      }
    ],
    size: [
      {
        required: true,
        message: 'size不能为空'
      }
    ]
  }
}
