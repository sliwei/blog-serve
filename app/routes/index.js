const router = require('koa-router')();

// 数据校验
const parameter = require('../utils/parameter');
// token校验
const {checkToken} = require('../utils/tool/token');
// 验证码校验
const {checkCode, checkGtCode} = require('../utils/tool/verification');

const {list, search, neighbor, clientDetail, does, recent, blogFriendList, num, tags, archives, category} = require('../controllers/client/blog');
const {get, post} = require('../controllers/test');
const {sys} = require('../controllers/manage/admin');
const {server_list, edit, blog_status, detail} = require('../controllers/manage/blog');
const {upload} = require('../controllers/manage/common');
const {category_list, operation_category} = require('../controllers/manage/category');
const {evaluate, comment_list, evaluate_list, evaluate_examine, evaluate_del} = require('../controllers/manage/comment');
const {get_configure, set_configure} = require('../controllers/manage/configure');
const {friend_list, operation_friend} = require('../controllers/manage/friend');
const {info, login, register} = require('../controllers/manage/login');
const {tag_list, operation_tag} = require('../controllers/manage/tag');
const {edit_user} = require('../controllers/manage/user');
const {code, gtCode} = require('../controllers/manage/verification');
const {index} = require('../controllers/index');
const {fzf} = require('../controllers/fzf');
const {type, data} = require('../controllers/client/expenses');
const {cmd, create, connection, socket} = require('../controllers/cmd');
const {io, ioCreate} = require('../controllers/io');

// client blog
router.get('/blog/client/blog/list', list);
router.get('/blog/client/blog/search', search);
router.get('/blog/client/blog/neighbor', neighbor);
router.get('/blog/client/blog/detail', clientDetail);
router.post('/blog/client/blog/does', does);
router.get('/blog/client/blog/recent', recent);
router.get('/blog/client/blog/friend_list', blogFriendList);
router.get('/blog/client/blog/num', num);
router.get('/blog/client/blog/tags', tags);
router.get('/blog/client/blog/archives', archives);
router.get('/blog/client/blog/category', category);
// test
router.get('/blog/test/get', get);
router.post('/blog/test/post', post);
// admin
router.get('/blog/manage/admin/sys', checkToken, sys);
// blog
router.get('/blog/manage/blog/server_list', checkToken, server_list);
router.post('/blog/manage/blog/edit', checkToken, edit);
router.post('/blog/manage/blog/blog_status', checkToken, blog_status);
router.get('/blog/manage/blog/detail', checkToken, detail);
// common
router.post('/blog/manage/common/upload', upload);
// category
router.get('/blog/manage/category/category_list', checkToken, category_list);
router.post('/blog/manage/category/operation_category', checkToken, operation_category);
// comment
router.post('/blog/manage/comment/evaluate', evaluate);
router.get('/blog/manage/comment/comment_list', checkToken, comment_list);
router.get('/blog/manage/comment/evaluate_list', evaluate_list);
router.post('/blog/manage/comment/evaluate_examine', checkToken, evaluate_examine);
router.post('/blog/manage/comment/evaluate_del', checkToken, evaluate_del);
// configure
router.get('/blog/manage/configure/get_configure', checkToken, get_configure);
router.post('/blog/manage/configure/set_configure', checkToken, set_configure);
// friend
router.post('/blog/manage/friend/friend_list', checkToken, friend_list);
router.post('/blog/manage/friend/operation_friend', checkToken, operation_friend);
// login
router.get('/blog/manage/login/info', checkToken, info);
router.post('/blog/manage/login/login', checkCode, parameter, login);
router.post('/blog/manage/login/gt_login', checkGtCode, login);
router.post('/blog/manage/login/register', checkCode, parameter, register);
// tag
router.get('/blog/manage/tag/tag_list', checkToken, tag_list);
router.post('/blog/manage/tag/operation_tag', checkToken, operation_tag);
// user
router.post('/blog/manage/user/edit_user', checkToken, edit_user);
// verification
router.get('/blog/manage/verification/code', parameter, code);
router.get('/blog/manage/verification/gtCode', gtCode);
// expenses
router.get('/blog/ex/type', type);
router.get('/blog/ex/data', data);
// xt
router.get('/blog/cmd', cmd);
router.get('/blog/create', create);
router.get('/blog/connection/:pid', connection);
// io
router.get('/blog/io', io);
router.get('/blog/io/create', ioCreate);
// index
router.get('/', index);
// fzf
router.get('*', fzf);

module.exports = router;
