/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'v_bstu_blog_tag',
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      is_del: {
        type: DataTypes.INTEGER(1),
        allowNull: true,
        defaultValue: '0'
      },
      id: {
        type: DataTypes.INTEGER(11),
        allowNull: false,
        primaryKey: true
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
      tableName: 'v_bstu_blog_tag'
    }
  )
}
