const Sequelize = require('sequelize');

module.exports = sequelize.define('Checkin', {
  ID: {
    type: Sequelize.STRING(30),
    primaryKey: true,
  },
  count: {
    type: Sequelize.TINYINT,
    allowNull: false,
    defaultValue: 0,
  },
  ongoing: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  alreadyChecked: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
