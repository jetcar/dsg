var Users = require(__dirname + '/../node_DAL/Users.js');
var Tokens = require(__dirname + '/../node_DAL/Tokens.js');
var sequelize = require(__dirname + '/../db.js');


module.exports = function (req, next) {
    if (!req.cookies.id)
        return new Promise(function (resolve, reject) { resolve(); });

    return Tokens.findOne({
        where: {
            userid: req.cookies.id,
            token: req.cookies.token,
        }
    }).then(function (token) {
        if (token == null)
            return new Promise(function (resolve, reject) { resolve(); });
        if (token.deviceid == undefined) {
            token.deviceid = req.cookies.deviceid;
            token.save().then(sequelize().sync());
            return Users.findOne({
                where: {
                    id: req.cookies.id,
                }
            });
        }
        else if (token.deviceid === req.cookies.deviceid) {
            return Users.findOne({
                where: {
                    id: req.cookies.id,
                }
            });
        }

    });






}