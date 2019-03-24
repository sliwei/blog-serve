const router = require('koa-router')();
const axios = require('axios');

router.prefix('/blog/test');

/**
 * GET TEST
 */
router.get('/get', async function (ctx, next) {
  let dat = await axios.get('http://127.0.0.1:3000/core/test/get');
  ctx.DATA.data = dat.data;
  ctx.DATA.message = 'This is the GET test.';
  ctx.body = ctx.DATA;
});

/**
 * POST TEST
 */
router.post('/post', function (ctx, next) {
  ctx.DATA.data = ctx.request.body;
  ctx.DATA.message = 'This is the POST test.';
  ctx.body = ctx.DATA;
});

module.exports = router;