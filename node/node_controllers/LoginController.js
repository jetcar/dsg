var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var Users = require(__dirname + '/../node_DAL/Users.js');
var sequelize = require(__dirname + '/../db.js');
var transporter = require(__dirname + '/../mail.js');
var Tokens = require(__dirname + '/../node_DAL/Tokens.js');
var crypto = require('crypto');
var secret = require(__dirname + '/mycrypto.js');





module.exports = function (app) {
    app.post('/api/login',
        urlencodedParser,
        function (req, res, next) {

            var mail = req.body.email;

            Users.findOne({
                where: { email: mail }
            })
                .then(function (foundUser) {
                    if (!foundUser) {
                        foundUser = {
                            id: guid(),
                            email: mail,
                            emailtoken: guid()
                        };
                        Users.create(foundUser).then(sequelize().sync()).then(sendMail(foundUser, req));

                    } else {
                        if (foundUser.emailtoken == null)
                            foundUser.emailtoken = guid();
                        foundUser.save().then(sequelize().sync()).then(sendMail(foundUser, req)).then(function () {
                            res.end();
                        });
                    }
                });
        });
    app.get('/account/login/userid/:userid/code/:code',
        function (req, res, next) {
            Users.findOne({
                where: {
                    id: req.params.userid,
                    emailtoken: req.params.code
                }
            })
                .then(function (foundUser) {
                    if (foundUser) {
                        {
                            var str = foundUser.id + foundUser.email;
                            var encrypted = crypto.createHmac('sha256', secret())
                                .update(str)
                                .digest('hex');
                            res.cookie('signature',
                                encrypted,
                                { expires: new Date(Date.now() + 1209600000), httpOnly: true });
                            res.cookie('id',
                                foundUser.id,
                                { expires: new Date(Date.now() + 1209600000), httpOnly: true });
                            res.cookie('mail',
                                foundUser.email,
                                { expires: new Date(Date.now() + 1209600000), httpOnly: true });
                            res.redirect('/index.html#!/records');
                        }

                    }
                    else {
                        res.redirect('/index.html#!/login');
                    }

                });
        });
}

function sendMail(foundUser, req) {
    var url = req.protocol + '://' + req.get('host');

    transporter().sendMail({
        from: 'dsgDsg <no-reply@dsgdsg.eu',
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