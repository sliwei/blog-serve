const router = require('koa-router')();
const axios = require('axios');

router.prefix('/blog/manage/common');

/**
 * POST TEST
 */
// router.post('/upload', async (ctx, next) => {
//   const file = ctx.request.files.file;
//   let dat = await axios.post({
//     url: '',
//
//   });
//   ctx.body = ctx.DATA;
// });

module.exports = router;