
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
var authorize = require(__dirname + '/authorize.js');
var Groups = require(__dirname + '/../node_DAL/Groups.js');




module.exports = function (app) {
    app.get('/api/groups',
        function (req, res, next) {
            var foundUser = authorize(req, next);
            if (foundUser) {
                Groups.findAll({ where: { userid: foundUser } })
                    .then(function (groups) {
                        res.end(JSON.stringify(groups));
                    });
            } else {
                res.status(401).end();
            }


        });

    app.post('/api/groups', urlencodedParser,
        function (req, res, next) {
            var foundUser = authorize(req, next);
            if (foundUser) {

                var group = {};
                group.userid = foundUser;
                if (typeof req.body.id == "number")
                    group.id = parseInt(req.body.id);
                if (typeof req.body.amount == "number")
                    group.amount = parseFloat(req.body.amount);
                if (typeof req.body.sequenceid == "number")
                    group.sequenceid = parseInt(req.body.sequenceid);
                group.name = req.body.name;
                group.time = new Date(req.body.time);

                var createorUpdate = null;
                if (!group.id) {
                    createorUpdate = Groups.create(group);
                    createorUpdate.then(sequelize().sync())
                    .then(function (data) {
                        res.end(JSON.stringify({ id: data.dataValues.id }));
                    }).catch(function data(err) {
                        return next(err);
                    });
                }
                else {
                    createorUpdate = Groups.update(group, { where: { id: group.id } });
                    createorUpdate.then(sequelize().sync())
                    .then(function (data) {
                        res.end(JSON.stringify({ id: group.id }));
                    }).catch(function data(err) {
                        return next(err);
                    });
                }
                
            } else {
                res.status(401).end();
            }


        });

    app.delete('/api/groups/:id',
      function (req, res, next) {
          var foundUser = authorize(req, next);
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
      });
}

