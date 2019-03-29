const router = require('koa-router')();
const os = require('os');
const {CustomError, HttpError} = require('../../tool/error');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('bdm296810572_db', 'bdm296810572', 'lw555wam', {
  host: 'bdm296810572.my3w.com',
  port: '3306',
  dialect: 'mysql',
  insecureAuth: true,
  dialectOptions: {
    insecureAuth: true
  }
});
//
// const User = sequelize.define('sequelize', {
//   name: Sequelize.STRING,
// });
//
// sequelize.sync()
//   .then(() => User.create({
//     name: 'janedoe',
//   }))
//   .then(jane => {
//     console.log(jane.toJSON());
//   });
// https://github.com/node-modules/parameter/blob/master/example.js
var Parameter = require('parameter');
var p = new Parameter();
p.addRule('name', function (e, v) {
  console.log(/^[a-z]$/.test(v));
  return '只能输入一个汉字!!';
})
// var parameter = new Parameter({
//   translate: function() {
//     var args = Array.prototype.slice.call(arguments);
//     // Assume there have I18n.t method for convert language.
//     // return I18n.__.apply(args);
//     // console.log(args);
//
//     // console.log(args);
//     return args;
//   },
//   validateRoot: true, // restrict the being validate value must be a object
// });
router.prefix('/blog/manage/admin');

router.get('/p', async (ctx, next) => {
  var data = {
    name: 'bsx',
    age: 24,
    gender: 'male'
  };

  var rule = {
    name: 'name',
    age: 'int',
    gender: ['ma2le1', 'female', 'unknown']
  };
  var errors;
  try{
    errors = p.validate(rule, data);
    console.log(errors);
  } catch (e) {
    console.log(e);
  }

  var User = sequelize.define('bstu_tag', {
    name: Sequelize.STRING,
  });

  User.findAll().then(function(result){
    console.log(result);
  });

  ctx.DATA.code = 0;
  ctx.DATA.data = errors;
  ctx.body = ctx.DATA;

});

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
