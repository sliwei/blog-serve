/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'ex_type',
    {
      id: {
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
      }
    },
    {
      tableName: 'ex_type'
    }
  )
}
