const router = require('koa-router')();
const {CustomError, HttpError} = require('./tool/error');

const test = require('./api/test');
const admin = require('./api/manage/admin');
const blog = require('./api/manage/blog');
const category = require('./api/manage/category');
const comment = require('./api/manage/comment');
const common = require('./api/manage/common');
const configure = require('./api/manage/configure');
const friend = require('./api/manage/friend');
const login = require('./api/manage/login');
const tag = require('./api/manage/tag');
const user = require('./api/manage/user');
const verification = require('./api/manage/verification');

const routes = [
  test,
  admin,
  blog,
  category,
  comment,
  common,
  configure,
  friend,
  login,
  tag,
  user,
  verification,
];

for (let route of routes) {
  router.use(route.routes(), route.allowedMethods())
}

const index = async (ctx, next) => {
  await ctx.render('index')
};

const fzf = async (ctx, next) => {
  throw new HttpError(404);
};

router.get('/', index);
router.get('*', fzf);

module.exports = router;
