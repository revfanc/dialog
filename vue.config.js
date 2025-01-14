module.exports = {
  // 禁用 source map
  productionSourceMap: false,

  // 不提取 CSS
  css: {
    extract: false,
    requireModuleExtension: false, // 禁用 CSS Modules
    loaderOptions: {
      css: {
        // 禁用 CSS Modules
        modules: false
      }
    }
  },

  chainWebpack: config => {
    // 设置 target
    config.set('target', ['web', 'es2015'])

    // 优化打包
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimize(true)
    }
  }
}
