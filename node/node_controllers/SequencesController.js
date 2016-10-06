﻿var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
var authorize = require(__dirname + '/authorize.js');
var Sequences = require(__dirname + '/../node_DAL/Sequences.js');




module.exports = function (app) {
    app.get('/api/sequences',
        function (req, res, next) {
            authorize(req, next).then(function (foundUser) {
                if (foundUser) {
                    Sequences.findAll({ where: { userid: foundUser.id } })
                        .then(function (sequences) {
                            res.end(JSON.stringify(sequences));
                        });
                } else {
                    res.status(401).end();
                }

            }).error(function (error) {
                res.status(401).end();

            });
        });
    app.post('/api/sequences', urlencodedParser,
       function (req, res, next) {
           authorize(req, next).then(function (foundUser) {
               if (foundUser) {
                   var sequence = req.body;
                   sequence.userid = foundUser.id;
                   sequence.amount = parseFloat(sequence.amount);
                   var createorUpdate = null;
                   if (!sequence.id)
                       createorUpdate = Sequences.create(sequence);
                   else {
                       createorUpdate = Sequences.update(sequence, { where: { id: sequence.id } });
                   }
                   createorUpdate.then(sequelize().sync())
                       .then(function (data) {
                           res.end(JSON.stringify({ id: data.dataValues.id }));
                       }).catch(function data(err) {
                           return next(err);
                       });;
               } else {
                   res.status(401).end();
               }

           }).catch(function (error) {
               return next(error);
           });
       });

    app.delete('/api/sequences/:id',
      function (req, res, next) {
          authorize(req, next).then(function (foundUser) {
              if (foundUser) {
                  Sequences.findById(req.params.id)
                          .then(function(sequence) {
                          sequence.destroy().then(sequelize().sync()).then(function (data) {
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
