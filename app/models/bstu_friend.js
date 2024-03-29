/* jshint indent: 2 */
const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bstu_friend',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: DataTypes.STRING(200),
        allowNull: true
      },
      create_time: {
        type: DataTypes.DATE,
        get() {
          return moment(this.getDataValue('create_time')).format(
            'YYYY/MM/DD HH:mm:ss'
          )
        },
        allowNull: true,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      u_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      is_del: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '0'
      }
    },
    {
      tableName: 'bstu_friend'
    }
  )
}
