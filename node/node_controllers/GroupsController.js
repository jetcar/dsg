
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
var authorize = require(__dirname + '/authorize.js');
var Groups = require(__dirname + '/../node_DAL/Groups.js');




module.exports = function (app) {
    app.get('/api/groups',
        function (req, res, next) {
            authorize(req,next).then(function (foundUser) {
                if (foundUser) {
                    Groups.findAll({ where: { userid: foundUser.id } })
                        .then(function (groups) {
                            res.end(JSON.stringify(groups));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function (error) {
                res.status(401).end();

            });
        });

    app.post('/api/groups', urlencodedParser,
        function (req, res, next) {
            authorize(req, next).then(function (foundUser) {
                if (foundUser) {
                    var group = req.body;
                    group.userid = foundUser.id;
                    group.amount = parseFloat(group.amount);
                    var createorUpdate = null;
                    if (!group.id)
                        createorUpdate = Groups.create(group);
                    else {
                        createorUpdate = Groups.update(group, { where: { id: group.id } });
                    }
                    createorUpdate.then(sequelize().sync())
                        .then(function (data) {
                            res.end(JSON.stringify({ id: data.dataValues.id }));
                        }).catch(function data(err) {
                            return next(err);
                        });
                } else {
                    res.status(401).end();
                }

            }).catch(function (error) {
                return next(error);

            });
        });

    app.delete('/api/groups/:id',
      function (req, res, next) {
          authorize(req, next).then(function (foundUser) {
              if (foundUser) {
                  Groups.findById(req.params.id)
                      .then(function (group) {
                          group.destroy().then(sequelize().sync()).then(function (data) {
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

