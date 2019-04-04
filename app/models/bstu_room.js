/* jshint indent: 2 */
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bstu_room', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR(40),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('create_time')).format('YYYY-MM-DD HH:mm:ss');
      },
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'bstu_room',
  });
};
