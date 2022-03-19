/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'bstu_blog_tag',
    {
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      t_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      },
      b_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
      }
    },
    {
      tableName: 'bstu_blog_tag'
    }
  )
}
