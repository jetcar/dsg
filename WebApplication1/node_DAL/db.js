﻿var Sequelize = require('sequelize');
var sequelize = new Sequelize('dsg', 'postgres', 'qqqqqq',
{
    dialect: 'postgres',
    host: 'localhost',
    port: 5432

});



module.exports = function() {
    return sequelize;
}