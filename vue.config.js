const fs = require('fs');
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    https: {
      key: fs.readFileSync('keys/key.pem'),
      cert: fs.readFileSync('keys/cert.pem'),
    },
    allowedHosts: "all",
  },

  transpileDependencies: true,

  chainWebpack: config => {
    config.optimization.minimizer('terser').tap((args) => {
      args[0].terserOptions.output = {
        ...args[0].terserOptions.output,
        comments: false  // exclude all comments from output
      }
      return args
    })
  },
})