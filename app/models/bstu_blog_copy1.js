/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bstu_blog_copy1', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    u_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tag_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    is_draft: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    is_del: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    good: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    bad: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    img: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'bstu_blog_copy1',
  });
};
