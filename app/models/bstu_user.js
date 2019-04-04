/* jshint indent: 2 */
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bstu_user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR(30),
      allowNull: true
    },
    user: {
      type: DataTypes.CHAR(30),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      get() {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    good: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    bad: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    newly_login: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('newly_login')).format('YYYY-MM-DD HH:mm:ss');
      },
      allowNull: true
    },
    head_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'bstu_user',
  });
};
