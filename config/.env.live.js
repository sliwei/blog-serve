'use strict'

module.exports = {
  env: 'live',
  api_url: {
  },
  db: {
    database: '##DATABASE##',
    username: '##USERNAME##',
    password: '##PASSWORD##',
    conf: {
      host: '##HOST##',
      port: '##PORT##',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      define: {
        insecureAuth: true,
        timestamps: false,
      },
      timezone: '+08:00'
    },
  },
  gt: {
    geetest_id: '##GT_ID##',
    geetest_key: '##GT_KEY##'
  }
}
