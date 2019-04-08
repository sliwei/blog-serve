const {sequelize, Sequelize} = require('../utils/sequelize');

const bstu_blog = require('./bstu_blog');
const bstu_blog_tag = require('./bstu_blog_tag');
const bstu_category = require('./bstu_category');
const bstu_comment = require('./bstu_comment');
const bstu_configure = require('./bstu_configure');
const bstu_friend = require('./bstu_friend');
const bstu_room = require('./bstu_room');
const bstu_room_message = require('./bstu_room_message');
const bstu_tag = require('./bstu_tag');
const bstu_user = require('./bstu_user');
const v_bstu_blog = require('./v_bstu_blog');
const v_bstu_blog_tag = require('./v_bstu_blog_tag');
const v_bstu_comment = require('./v_bstu_comment');

const BstuBlog = bstu_blog(sequelize, Sequelize);
const BstuBlogTag = bstu_blog_tag(sequelize, Sequelize);
const BstuCategory = bstu_category(sequelize, Sequelize);
const BstuComment = bstu_comment(sequelize, Sequelize);
const BstuConfigure = bstu_configure(sequelize, Sequelize);
const BstuFriend = bstu_friend(sequelize, Sequelize);
const BstuRoom = bstu_room(sequelize, Sequelize);
const BstuRoomMessage = bstu_room_message(sequelize, Sequelize);
const BstuTag = bstu_tag(sequelize, Sequelize);
const BstuUser = bstu_user(sequelize, Sequelize);
const VBstuBlog = v_bstu_blog(sequelize, Sequelize);
const VBstuBlogTag = v_bstu_blog_tag(sequelize, Sequelize);
const VBstuComment = v_bstu_comment(sequelize, Sequelize);

/**
 * Associations - 关联
 * belongsTo BelongsTo 关联是在 source model 上存在一对一关系的外键的关联
 * HasOne HasOne 关联是在 target model 上存在一对一关系的外键的关联
 * hasMany 一对多关联将一个来源与多个目标连接起来。 而多个目标接到同一个特定的源
 * belongsToMany 多对多关联用于将源与多个目标相连接。 此外，目标也可以连接到多个源
 */
BstuComment.belongsTo(BstuUser, {as: 'c_user', foreignKey: 'u_id'}); // 评论 -> 用户(评论人)
// BstuComment.belongsTo(BstuUser, {as: 'f_user', foreignKey: 'f_id'}); // 评论 -> 用户(被回复人)
BstuComment.belongsTo(BstuComment, {as: 'comment', foreignKey: 'f_id'}); // 评论 -> 用户(被回复人)
BstuComment.belongsTo(BstuBlog, {as: 'blog', foreignKey: 'b_id'}); // 评论 -> 博客
BstuBlog.belongsTo(BstuUser, {as: 'user', foreignKey: 'u_id'}); // 博客 -> 用户
BstuBlog.belongsTo(BstuCategory, {as: 'category', foreignKey: 'category_id'}); // 博客 -> 分类
BstuBlog.hasMany(VBstuBlogTag, {as: 'tag_list', foreignKey: 'b_id'}); // 博客 => 博客标签视图
BstuBlog.hasMany(BstuBlogTag, {as: 'blog_tag', foreignKey: 'b_id'}); // 博客 => 博客标签

module.exports = {
  BstuBlog,
  BstuBlogTag,
  BstuCategory,
  BstuComment,
  BstuConfigure,
  BstuFriend,
  BstuRoom,
  BstuRoomMessage,
  BstuTag,
  BstuUser,
  VBstuBlog,
  VBstuBlogTag,
  VBstuComment,
  sequelize,
  Sequelize,
};
