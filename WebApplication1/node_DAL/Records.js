var Sequelize = require('sequelize');
var sequelize = require(__dirname + '/db.js');

module.exports = sequelize().define('records', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, },
    amount: Sequelize.DECIMAL,
    name: Sequelize.STRING,
    time: Sequelize.DATE,
    groupid: Sequelize.INTEGER,
    userid: { type: Sequelize.STRING, allowNull: false },
    sequenceid: Sequelize.INTEGER,
    paid: Sequelize.BOOLEAN

});