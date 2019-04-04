/* jshint indent: 2 */
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('v_bstu_blog', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    u_id: {
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
      allowNull: true,
      get() {
        return moment(this.getDataValue('time')).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    img: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_evaluate: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    markdown: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: '0000-00-00 00:00:00'
    },
    code: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    category_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_name: {
      type: DataTypes.CHAR(30),
      allowNull: true
    }
  }, {
    tableName: 'v_bstu_blog',
  });
};
