/* jshint indent: 2 */
const moment = require('moment')

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bstu_blog',
    {
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
        get() {
          return moment(this.getDataValue('time')).format('YYYY/MM/DD HH:mm:ss')
        },
        allowNull: true
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
        get() {
          return moment(this.getDataValue('create_time')).format(
            'YYYY/MM/DD HH:mm:ss'
          )
        },
        allowNull: false,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
      },
      code: {
        type: DataTypes.CHAR(10),
        allowNull: true
      },
      category_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }
    },
    {
      tableName: 'bstu_blog'
    }
  )
}
