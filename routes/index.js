const router = require('koa-router')();

const test = require('./api/test');
const blog = require('./api/blog');
const common = require('./api/common');
const verification = require('./api/verification');

const routes = [
  test,
  blog,
  common,
  verification,
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
