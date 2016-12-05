var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var sequelize = require(__dirname + '/../db.js');
var authorize = require(__dirname + '/authorize.js');
var Sequences = require(__dirname + '/../node_DAL/Sequences.js');




module.exports = function (app) {
    app.get('/api/sequences',
        function (req, res, next) {
            var foundUser = authorize(req, next);
            if (foundUser) {

                Sequences.findAll({ where: { userid: foundUser } })
                    .then(function (sequences) {
                        res.end(JSON.stringify(sequences));
                    });
            } else {
                res.status(401).end();
            }

        }
        );
    app.post('/api/sequences', urlencodedParser,
       function (req, res, next) {
           var foundUser = authorize(req, next);
           if (foundUser) {
               var sequence = {};
               sequence.userid = foundUser;
               if (typeof req.body.id == "number")
                   sequence.id = parseInt(req.body.id);
               if (typeof req.body.amount == "number")
                   sequence.amount = parseFloat(req.body.amount);
               sequence.group = req.body.group === true;

               sequence.name = req.body.name;
               sequence.time = new Date(req.body.time);
             var createorUpdate = null;
               if (!sequence.id) {
                   createorUpdate = Sequences.create(sequence);
                   createorUpdate.then(sequelize().sync())
                   .then(function (data) {
                       res.end(JSON.stringify({ id: data.dataValues.id }));
                   }).catch(function data(err) {
                       return next(err);
                   });
               }
               else {
                   createorUpdate = Sequences.update(sequence, { where: { id: sequence.id } });
                   createorUpdate.then(sequelize().sync())
                   .then(function (data) {
                       res.end(JSON.stringify({ id: sequence.id }));
                   }).catch(function data(err) {
                       return next(err);
                   });
               }
               
           } else {
               res.status(401).end();
           }


       });

    app.delete('/api/sequences/:id',
      function (req, res, next) {
          var foundUser = authorize(req, next);
          if (foundUser) {
              Sequences.findById(req.params.id)
                          .then(function (sequence) {
                              sequence.destroy().then(sequelize().sync()).then(function (data) {
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
