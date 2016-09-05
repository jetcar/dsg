var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var Users = require(__dirname + '/../node_DAL/Users.js');
var sequelize = require(__dirname + '/../db.js');
var transporter = require(__dirname + '/../mail.js');





module.exports = function (app) {
    app.post('/api/login',
        urlencodedParser,
        function (req, res) {

            var mail = req.body.email;

            Users.findOne({
                where: { email: mail }
            })
                .then(function (foundUser) {
                    if (!foundUser) {
                        foundUser = {
                            id: guid(),
                            email: mail,
                            token: guid(),
                            emailtoken: guid()
                        };
                        Users.create(foundUser).then(sequelize().sync()).then(sendMail(foundUser, req));

                    } else {
                        foundUser.emailtoken = guid();
                        foundUser.save().then(sequelize().sync()).then(sendMail(foundUser, req)).then(function() {
                            res.end();
                        });
                    }
                });
        });
    app.get('/account/login/userid/:userid/code/:code',
        function (req, res) {
            Users.findOne({
                where: {
                    id: req.params.userid,
                    emailtoken: req.params.code
                }
            })
                .then(function (foundUser) {
                    foundUser.token = guid();
                    foundUser.emailtoken = null;
                    foundUser.save()
                        .then(sequelize().sync())
                        .then(function () {
                            res.cookie('token',
                                foundUser.token + '|' + foundUser.id,
                                { httpOnly: true });
                            res.redirect('/index.html#!/records');
                        });

                });
        });
}

function sendMail(foundUser, req) {
    var url = req.protocol + '://' + req.get('host');

    transporter().sendMail({
        from: 'no-reply@' + req.get('host'),
        to: foundUser.email,
        subject: 'Login link',
        html: '<a href="' + url + '/account/login/userid/' + foundUser.id + '/code/' +
            foundUser.emailtoken +
            '">Login</a>'
    },
                       function (error, response) {
                           if (error) {
                               console.log(error);
                           } else {
                               console.log('Message sent');
                           }
                       });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}