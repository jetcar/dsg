
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../node_DAL/db.js');
var Records = require(__dirname + '/../node_DAL/Records.js');
var authorize = require(__dirname + '/authorize.js');




module.exports = function (app) {
    app.get('/api/records',
        function (req, res) {
            authorize(req).then(function (foundUser) {
                if (foundUser) {
                    Records.findAll({ where: { userid: foundUser.id } })
                        .then(function (records) {
                            res.end(JSON.stringify(records));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function (error) {
                res.status(401).end();

            });
        });

    app.post('/api/records', urlencodedParser,
        function (req, res) {
            authorize(req).then(function (foundUser) {
                if (foundUser) {
                    var record = req.body;
                    record.userid = foundUser.id;
                    Records.create(record).then(sequelize().sync())
                        .then(function (record) {
                            res.end(JSON.stringify(record));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function (error) {
                res.status(401).end();

            });
        });
}
