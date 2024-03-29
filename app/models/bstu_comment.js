/* jshint indent: 2 */
const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bstu_comment',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      u_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      b_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      f_id: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      cont: {
        type: DataTypes.STRING(5000),
        allowNull: true
      },
      is_del: {
        type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
        allowNull: false,
        defaultValue: 0
      },
      is_pass: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        defaultValue: 0
      },
      create_time: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('create_time')).format(
            'YYYY/MM/DD HH:mm:ss'
          )
        },
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      type: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '0'
      }
    },
    {
      tableName: 'bstu_comment'
    }
  )
}
