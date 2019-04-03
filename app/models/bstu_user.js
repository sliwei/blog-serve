/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('bstu_user', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.CHAR(30),
      allowNull: true
    },
    user: {
      type: DataTypes.CHAR(30),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    mail: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    create_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    website: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    good: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    bad: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
      defaultValue: '0'
    },
    newly_login: {
      type: DataTypes.DATE,
      allowNull: true
    },
    head_img: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'bstu_user',
  });
};
