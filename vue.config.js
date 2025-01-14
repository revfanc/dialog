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
  }
}
