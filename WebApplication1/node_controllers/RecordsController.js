
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
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
        function (req, res, next) {
            authorize(req, next).then(function (foundUser) {
                if (!foundUser) {
                    res.status(401).end();
                    return next("unauthorized");
                }

                var record = req.body;
                record.userid = foundUser.id;
                record.amount = parseFloat(record.amount);
                var createorUpdate = null;
                if (!record.id)
                    createorUpdate = Records.create(record);
                else {
                    createorUpdate = Records.update(record, { where: { id: record.id } });
                }
                createorUpdate.then(sequelize().sync())
                    .then(function (data) {
                        res.end(JSON.stringify(data));
                    }).catch(function data(err) {
                        return next(err);
                    });


            }).catch(function (error) {
                res.status(401).end();

            });
        });

    app.delete('/api/records/:id',
        function (req, res, next) {
            authorize(req).then(function (foundUser) {
                if (foundUser) {
                    Records.findById(req.params.id)
                        .then(function (record) {
                            record.destroy().then(sequelize().sync()).then(function (data) {
                                res.end();
                            }).catch(function data(err) {
                                return next(err);
                            });
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function (error) {
                res.status(401).end();

            });
        });
}
