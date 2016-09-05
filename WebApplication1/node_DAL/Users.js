var Sequelize = require('sequelize');
var sequelize = require(__dirname + '/../db.js');

module.exports = sequelize().define('users', {
    id: { type: Sequelize.STRING, primaryKey: true },
    email: Sequelize.STRING,
    token: Sequelize.STRING,
    emailtoken: Sequelize.STRING
});