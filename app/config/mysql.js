/**
 * lw 数据库配置
 * @type {{debug: boolean, client: string, connection: {charset: string, password: string, database: string, port: string, insecureAuth: boolean, host: string, user: string}}}
 */
module.exports = {
  database: 'bdm296810572_db',
  username: 'root',
  password: '123456',
  conf: {
    host: '127.0.0.1',
    port: '3306',
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
};
