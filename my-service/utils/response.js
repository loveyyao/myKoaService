function getResponseSuccess (data, status = 200, msg = '操作成功') {
  return {
    code: status,
    success: true,
    data,
    msg
  }
}
function getResponseError (data, status = 500, msg = '服务器异常') {
  return {
    code: status,
    success: false,
    data,
    msg
  }
}
module.exports = {
  success: getResponseSuccess,
  error: getResponseError
}
