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
BstuComment.belongsTo(BstuUser, {as: 'c_user', foreignKey: 'u_id'});
BstuComment.belongsTo(BstuUser, {as: 'f_user', foreignKey: 'f_id'});
BstuComment.belongsTo(BstuBlog, {as: 'blog', foreignKey: 'b_id'});

// BstuBlog.hasMany(BstuBlogTag, {as: 'tag', foreignKey: 'category_id'});
// BstuBlogTag.belongsTo(BstuTag, {as: 'tag', foreignKey: 'category_id'});
// BstuTag.hasMany(BstuBlogTag, {as: 'tag', foreignKey: 'category_id'});
// BstuCategory.hasMany(BstuBlog, {as: 'blog', foreignKey: 'category_id'});

// init
// removeAttribute
// sync
// drop
// schema
// getTableName
// scope
// addScope
// findAll
// findByPk
// findByPk
// findOne
// findOne
// aggregate
// count
// findAndCountAll
// max
// min
// sum
// build
// bulkBuild
// create
// create
// findOrBuild
// findOrCreate
// upsert
// bulkCreate
// truncate
// destroy
// restore
// update
// increment
// increment
// increment
// describe
// unscoped
// beforeValidate
// beforeValidate
// afterValidate
// afterValidate
// beforeCreate
// beforeCreate
// afterCreate
// afterCreate
// beforeDestroy
// beforeDestroy
// afterDestroy
// afterDestroy
// beforeUpdate
// beforeUpdate
// afterUpdate
// afterUpdate
// beforeBulkCreate
// beforeBulkCreate
// afterBulkCreate
// afterBulkCreate
// beforeBulkDestroy
// beforeBulkDestroy
// afterBulkDestroy
// afterBulkDestroy
// beforeBulkUpdate
// beforeBulkUpdate
// afterBulkUpdate
// afterBulkUpdate
// beforeFind
// beforeFind
// beforeCount
// beforeCount
// beforeFindAfterExpandIncludeAll
// beforeFindAfterExpandIncludeAll
// beforeFindAfterOptions
// beforeFindAfterOptions
// afterFind
// afterFind
// beforeBulkSync
// beforeBulkSync
// afterBulkSync
// afterBulkSync
// beforeSync
// beforeSync
// afterSync
// afterSync
// hasOne
// belongsTo
// hasMany
// belongsToMany

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
