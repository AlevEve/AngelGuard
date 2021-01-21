const { compile } = require('nexe')

compile({
  input: __dirname + '/index.js',
  build: true, //required to use patches
  patches: [
    async (compiler, next) => {
      await compiler.setFileContentsAsync(
        'lib/new-native-module.js',
        'module.exports = 42'
      )
      return next()
    }
  ]
}).then(() => {
  console.log('success')
})