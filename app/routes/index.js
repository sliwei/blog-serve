const router = require('koa-router')();
const parameter = require('../utils/parameter');
const {checkToken} = require('../utils/tool/token');
const {checkCode} = require('../utils/tool/verification');

const {get, post} = require('../controllers/test');
const {sys} = require('../controllers/manage/admin');
const {code} = require('../controllers/manage/verification');
const {info, login, register} = require('../controllers/manage/login');
const {server_list, edit, blog_status, detail} = require('../controllers/manage/blog');
const {tag_list, operation_tag} = require('../controllers/manage/tag');
const {upload} = require('../controllers/manage/common');
const {category_list, operation_category} = require('../controllers/manage/category');
const {evaluate, comment_list, evaluate_list, evaluate_examine, evaluate_del} = require('../controllers/manage/comment');

const {index} = require('../controllers');
const {fzf} = require('../controllers/fzf');


router.get('/blog/test/get', get);
router.post('/blog/test/post', post);

router.get('/blog/manage/admin/sys', sys);

router.get('/blog/manage/verification/code', parameter, code);

router.get('/blog/manage/login/info', checkToken, info);
router.post('/blog/manage/login/login', checkCode, parameter, login);
router.post('/blog/manage/login/register', checkCode, parameter, register);

router.get('/blog/manage/blog/server_list', checkToken, server_list);
router.post('/blog/manage/blog/edit', checkToken, edit);
router.post('/blog/manage/blog/blog_status', checkToken, blog_status);
router.get('/blog/manage/blog/detail', checkToken, detail);

router.post('/blog/manage/common/upload', checkToken, upload);

router.get('/blog/manage/category/category_list', checkToken, category_list);
router.post('/blog/manage/category/operation_category', checkToken, operation_category);

router.get('/blog/manage/tag/tag_list', checkToken, tag_list);
router.get('/blog/manage/tag/operation_tag', checkToken, operation_tag);

router.get('/blog/manage/comment/evaluate', checkToken, evaluate);
router.get('/blog/manage/comment/comment_list', checkToken, comment_list);
router.get('/blog/manage/comment/evaluate_list', evaluate_list);
router.get('/blog/manage/comment/evaluate_examine', checkToken, evaluate_examine);
router.get('/blog/manage/comment/evaluate_del', checkToken, evaluate_del);

router.get('/', index);
router.get('*', fzf);

module.exports = router;
