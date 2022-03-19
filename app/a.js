var Koa = require('koa')
var app = new Koa()
const Router = require('koa-router')
const fs = require('fs')
const views = require('koa-views')
const logger = require('koa-logger')
const { resolve } = require('path')

const socket = require('./controllers/io')

// koa-logger
app.use(logger())

// 模板引擎
app.use(views(resolve(__dirname, './views'), { map: { html: 'nunjucks' } }))

let router = new Router()

router.get('/', async (ctx) => {
  await ctx.render('sk')
})

app.use(router.routes(), router.allowedMethods())

// socket连接
const server = socket(app)

module.exports = server
