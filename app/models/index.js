const Blog = require('./blog');
const Category = require('./category');

/**
 * Associations - 关联
 * belongsTo BelongsTo 关联是在 source model 上存在一对一关系的外键的关联
 * HasOne HasOne 关联是在 target model 上存在一对一关系的外键的关联
 * hasMany 一对多关联将一个来源与多个目标连接起来。 而多个目标接到同一个特定的源
 * belongsToMany 多对多关联用于将源与多个目标相连接。 此外，目标也可以连接到多个源
 */
Blog.belongsTo(Category, {as: 'category', foreignKey: 'category_id'});
Category.hasMany(Blog, {as: 'blog', foreignKey: 'category_id'});


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
  Blog,
  Category,
};
