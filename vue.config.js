const fs = require('fs');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    https: {
      key: fs.readFileSync('keys/key.pem'),
      cert: fs.readFileSync('keys/cert.pem'),
    },
    allowedHosts: "all",
  },
  transpileDependencies: true
})
