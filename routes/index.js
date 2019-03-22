const router = require('koa-router')();

const oss = require('./api/oss');
const socket = require('./api/socket');
const test = require('./api/test');
const user = require('./api/user');
const verification = require('./api/verification');
const blog = require('./api/blog');

const routes = [
  oss,
  socket,
  test,
  user,
  verification,
  blog,
];

for (let route of routes) {
  router.use(route.routes(), route.allowedMethods())
}

const index = async (ctx, next) => {
  await ctx.render('index')
};

const fzf = async (ctx, next) => {
  await ctx.render('404')
};

router.get('/', index);
router.get('*', fzf);

module.exports = router;
