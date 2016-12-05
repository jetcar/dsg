
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
var Records = require(__dirname + '/../node_DAL/Records.js');
var authorize = require(__dirname + '/authorize.js');




module.exports = function (app) {
    app.get('/api/records',
        function (req, res, next) {
            var foundUser = authorize(req, next);
            if (foundUser) {
                Records.findAll({ where: { userid: foundUser } })
                    .then(function (records) {
                        res.end(JSON.stringify(records));
                    });
            } else {
                res.status(401).end();
            }


        });

    app.post('/api/records', urlencodedParser,
        function (req, res, next) {
            var foundUser = authorize(req, next);
            if (foundUser) {
                var record = {};
                record.userid = foundUser;
                if (typeof req.body.id == "number")
                    record.id = parseInt(req.body.id);
                if (typeof req.body.amount == "number")
                    record.amount = parseFloat(req.body.amount);
                if (typeof req.body.groupid == "number")
                    record.groupid = parseInt(req.body.groupid);
                if (typeof req.body.sequenceid == "number")
                    record.sequenceid = parseInt(req.body.sequenceid);
                record.name = req.body.name;
                record.paid = req.body.paid === true;
                record.time = new Date(req.body.time);
                var createorUpdate = null;
                if (!record.id) {
                    createorUpdate = Records.create(record);
                    createorUpdate.then(sequelize().sync())
                    .then(function (data) {
                        res.end(JSON.stringify({ id: data.dataValues.id }));
                    }).catch(function data(err) {
                        return next(err);
                    });
                }
                else {
                    createorUpdate = Records.update(record, { where: { id: record.id } });
                    createorUpdate.then(sequelize().sync())
                    .then(function (data) {
                        res.end(JSON.stringify({ id: record.id }));
                    }).catch(function data(err) {
                        return next(err);
                    });
                }



            }
        });

    app.delete('/api/records/:id',
        function (req, res, next) {
            var foundUser = authorize(req, next);
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


        });
}
