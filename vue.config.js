const fs = require('fs');
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    https: {
      key: fs.readFileSync('../../../../../etc/letsencrypt/live/soongsil.us/privkey.pem'),
      cert: fs.readFileSync('../../../../../etc/letsencrypt/live/soongsil.us/cert1.pem'),
    },
  },
  transpileDependencies: true
})
