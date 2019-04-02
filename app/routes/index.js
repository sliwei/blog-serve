const router = require('koa-router')();
const parameter = require('../parameter');
const {checkToken} = require('./tool/token');
const {checkCode} = require('./tool/verification');

const {info, login, register} = require('../controllers/manage/login');
const {code} = require('../controllers/manage/verification');
const {p, sys} = require('../controllers/manage/admin');
const {get, post} = require('../controllers/test');
const {index} = require('../controllers');
const {fzf} = require('../controllers/fzf');


router.get('/blog/manage/login/info', checkToken, info);
router.post('/blog/manage/login/login', checkCode, login);
router.post('/blog/manage/login/register', checkCode, register);

router.get('/blog/manage/verification/code', code);

router.get('/blog/manage/admin/p', parameter, p);
router.get('/blog/manage/admin/sys', parameter, sys);

router.get('/blog/test/get', get);
router.post('/blog/test/post', post);

router.get('/', index);
router.get('*', fzf);

module.exports = router;
