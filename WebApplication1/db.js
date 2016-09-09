var Sequelize = require('sequelize');
var sequelize = new Sequelize('dsg', 'postgres', '1Qqqqqqq',
{
    dialect: 'postgres',
    host: 'dsgdsg.eu',
    port: 5432

});



module.exports = function() {
    return sequelize;
}