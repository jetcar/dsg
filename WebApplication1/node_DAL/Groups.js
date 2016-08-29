var Sequelize = require('sequelize');
var sequelize = require(__dirname + '/db.js');

module.exports = sequelize().define('groups', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    amount: Sequelize.DECIMAL,
    name: Sequelize.STRING,
    time: Sequelize.DATE,
    sequenceid: Sequelize.INTEGER,
    userid: Sequelize.STRING

});