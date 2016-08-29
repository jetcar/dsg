var Sequelize = require('sequelize');
var sequelize = require(__dirname + '/db.js');

module.exports = sequelize().define('sequences', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    amount: Sequelize.DECIMAL,
    name: Sequelize.STRING,
    time: Sequelize.DATE,
    userid: Sequelize.STRING,
    isgroup: Sequelize.BOOLEAN

});