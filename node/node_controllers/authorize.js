var Users = require(__dirname + '/../node_DAL/Users.js');
var Tokens = require(__dirname + '/../node_DAL/Tokens.js');
var sequelize = require(__dirname + '/../db.js');
var crypto = require('crypto');
var secret = require(__dirname + '/mycrypto.js');


module.exports = function(req, next) {
    if (!req.cookies.id)
        return null;
    else {
        var str = req.cookies.id + req.cookies.mail;
        var encrypted = crypto.createHmac('sha256', secret())
            .update(str)
            .digest('hex');
        if (encrypted === req.cookies.signature)
            return req.cookies.id;
    }
}
