/* jshint indent: 2 */
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('v_ex_view', {
    date: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return moment(this.getDataValue('date')).format('YYYY/MM');
      },
    },
    num: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    type_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
  }, {
    tableName: 'v_ex_view',
  });
};
