var Users = require(__dirname + '/../node_DAL/Users.js');


module.exports = function (req, next) {
    if (!req.cookies.token)
        return next("unauthorized");
    return Users.findOne({
        where: {
            id: req.cookies.token.split('|')[1],
            token: req.cookies.token.split('|')[0]
        }
    });
}