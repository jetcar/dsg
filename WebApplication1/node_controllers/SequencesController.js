
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../node_DAL/db.js');
var authorize = require(__dirname + '/authorize.js');
var Sequences = require(__dirname + '/../node_DAL/Sequences.js');
var cookieParser = require('cookie-parser');




module.exports = function (app) {
    app.get('/api/sequences',
        function (req, res) {
            authorize(req).then(function (foundUser) {
                if (foundUser) {
                    Sequences.findAll({ where: { userid: foundUser.id } })
                        .then(function (sequences) {
                            res.end(JSON.stringify(sequences));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function(error) {
                res.status(401).end();

            });
        });
}
