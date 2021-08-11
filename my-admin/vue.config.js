const path = require('path')

const resolve = (dir) => path.join(__dirname, dir)

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  devServer: {
    disableHostCheck: true,
    port: 3939,
    open: true,
    proxy: {
      '/ybs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          ['^/ybs']: ''
        }
      }
    }
  }
}
