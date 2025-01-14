module.exports = {
  presets: [
    ['@vue/cli-plugin-babel/preset', {
      useBuiltIns: false,
      targets: {
        browsers: [
          'last 2 versions',
          'not dead',
          'not ie 11'
        ]
      }
    }]
  ]
}
