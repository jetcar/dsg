
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../node_DAL/db.js');
var authorize = require(__dirname + '/authorize.js');
var Groups = require(__dirname + '/../node_DAL/Groups.js');
var cookieParser = require('cookie-parser');




module.exports = function (app) {
    app.get('/api/groups',
        function (req, res) {
            authorize(req).then(function (foundUser) {
                if (foundUser) {
                    Groups.findAll({ where: { userid: foundUser.id } })
                        .then(function (groups) {
                            res.end(JSON.stringify(groups));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function(error) {
                res.status(401).end();

            });
        });
}

