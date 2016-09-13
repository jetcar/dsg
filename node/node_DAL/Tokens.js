var Sequelize = require('sequelize');
var sequelize = require(__dirname + '/../db.js');

module.exports = sequelize().define('tokens', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    userid:  Sequelize.STRING,
    token: Sequelize.STRING,
    deviceid: Sequelize.STRING,
});