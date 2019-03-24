const router = require('koa-router')();
const {createToken, checkToken} = require('../tool/token');
const {checkCode} = require('../tool/verification');
const {CustomError, HttpError} = require('../tool/error');

router.prefix('/blog/manage/admin');

/**
 * lw 获取服务器信息
 * @param {Number|String} freemem 服务器可用内存数
 * @param {Array} cpu {model:cpu内核模型，speed：cpu频率，times：其他}
 * @param {String} hostname 服务器主机名
 * @param {String} platform Node.js编译时的操作系统平台
 * @param {String} release 服务器发行版本
 * @param {Number|String} totalmem 系统内存总数
 * @param {String} type 操作系统
 * @param {String} constants 运行状态 0正常 1不正常
 */
router.get('/sys', async (ctx, next) => {

  let {parseInt} = Number;
  let {freemem, cpus, hostname, platform, release, totalmem, type, constants} = os;
  let total = parseInt(totalmem() / 1024 / 1024);
  let num = parseInt(freemem() / 1024 / 1024);
  let percentage = parseInt((num / total) * 100);

  ctx.DATA.data = {
    hostname: hostname(),
    platform: platform(),
    release: release(),
    percentage,
    type: type(),
    totalmem: `${total}MB`,
    freemem: `${num}MB`,
    constants: constants.SIGTRAP ? '1' : '0',
    cpu: cpus(),
  };
  ctx.body = ctx.DATA;
});

module.exports = router;
