const fs = require('fs');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    https: {
      key: fs.readFileSync('keys/privkey1.pem'),
      cert: fs.readFileSync('keys/cert1.pem'),
    },
  },
  transpileDependencies: true
})
