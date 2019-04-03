/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('v_bstu_comment', {
    u_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
    },
    f_id: {
      type: DataTypes.INTEGER(10),
      allowNull: true
    },
    b_id: {
      type: DataTypes.INTEGER(10),
      allowNull: false
    },
    cont: {
      type: DataTypes.STRING(5000),
      allowNull: false
    },
    is_del: {
      type: DataTypes.INTEGER(1).UNSIGNED.ZEROFILL,
      allowNull: false
    },
    is_pass: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: '0'
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: '0000-00-00 00:00:00'
    },
    type: {
      type: DataTypes.INTEGER(1),
      allowNull: true,
      defaultValue: '0'
    },
    code: {
      type: DataTypes.CHAR(10),
      allowNull: true
    }
  }, {
    tableName: 'v_bstu_comment',
  });
};
