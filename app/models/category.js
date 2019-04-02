const {Sequelize, sequelize} = require('../sequelize')

const Category = sequelize.define('bstu_category', {
  id: {type: Sequelize.INTEGER, primaryKey: true},
  name: Sequelize.STRING,
}, {
  freezeTableName: true,
  timestamps: false,
});

module.exports = Category;
