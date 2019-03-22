const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');

router.prefix('/yun/test');

router.get('/get', async (ctx, next) => {
    let token = await createToken({id: 1});
    console.log(token.data);
    ctx.DATA.data = {
        ...token.data.data
    };
    ctx.DATA.message = 'this is a get test and jenkins!';
    ctx.body = ctx.DATA;
});

router.get('/token', checkToken, async (ctx, next) => {
    console.log(ctx.res.USER);
    ctx.DATA.data = ctx.res.USER;
    ctx.DATA.message = 'this is a get test and jenkins!';
    ctx.body = ctx.DATA;
});

router.post('/post', function (ctx, next) {
    ctx.DATA.data = ctx.request.body;
    ctx.DATA.message = 'this is a post test and jenkins!';
    ctx.cookie.set('MMS30', 'test')
    ctx.body = ctx.DATA;
});

module.exports = router;
