/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bstu_configure',
    {
      c_key: {
        type: DataTypes.CHAR(11),
        allowNull: true
      },
      val: {
        type: DataTypes.CHAR(11),
        allowNull: true
      },
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
      }
    },
    {
      tableName: 'bstu_configure'
    }
  )
}
