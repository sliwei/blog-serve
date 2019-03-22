const router = require('koa-router')();
const {checkToken} = require('../tool/token');
const socket = require('../tool/socket');

router.prefix('/yun/socket');

router.get('/test', checkToken, function (ctx, next) {
    let sk = socket.set();
    sk.sockets.emit('number', 'BBB');
    ctx.DATA.data = ctx.res.USER;
    ctx.body = ctx.DATA;
});

module.exports = router;
