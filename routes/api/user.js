const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const md5 = require('js-md5');
const db = require('../database');

router.prefix('/yun/user');

/**
 * lw 验证信息
 */
router.get('/info', checkToken, async(ctx, next) => {
    let user = ctx.res.USER;
    let userDat = await db.op(`select * from cloud_disk_user where id = ${user.id}`);
    ctx.DATA.data = {
        name: userDat[0].name,
        users: userDat[0].users,
        sex: userDat[0].sex,
        login_time: userDat[0].login_time,
        head_img: userDat[0].head_img
    };
    ctx.body = ctx.DATA;
});

/**
 * lw 登录
 */
router.post('/login', checkCode, async(ctx, next) => {
    let dat = ctx.request.body;
    let data = await db.op(`select id from cloud_disk_user where users = "${dat.userName}" and password = "${md5(dat.password)}" limit 1`)
    if (data.length) {
        ctx.DATA.data = {
            token: createToken({id: data[0].id})
        }
        // ctx.cookie.set('token', createToken({id: data[0].id}))
    }else{
        ctx.DATA.code = 0;
        ctx.DATA.message = '账户名或密码错误'
    }
    ctx.body = ctx.DATA;
});

/**
 * lw 注册
 */
router.post('/register', checkCode, async(ctx, next) => {
    let dat = ctx.request.body;
    let news = await db.op(`insert into cloud_disk_user(users, password) values("${dat.name}", "${md5(dat.rpassword)}")`);
    if (news.affectedRows < 1) {
        ctx.DATA.code = 0;
        ctx.DATA.message = '注册失败';
    }
    ctx.body = ctx.DATA;
});

module.exports = router;
