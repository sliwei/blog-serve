const {Sequelize, sequelize} = require('../sequelize')

const Blog = sequelize.define('bstu_blog', {
  category_id: Sequelize.INTEGER,
  title: Sequelize.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Blog;
