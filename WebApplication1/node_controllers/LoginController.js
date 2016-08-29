﻿var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.json();
var Users = require(__dirname + '/../node_DAL/Users.js');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

var sequelize = require(__dirname + '/../node_DAL/db.js');


var transporter = nodemailer.createTransport(smtpTransport({
    port: 255,
    host: 'localhost',
    tls: {
        ciphers: 'SSLv3'
    },
    secure: false,
}));


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
                        Users.create(foundUser).then(sequelize().sync()).then(sendMail(foundUser));

                    } else {
                        foundUser.emailtoken = guid();
                        foundUser.save().then(sequelize().sync()).then(sendMail(foundUser));
                    }



                });
        });
    app.get('/api/login:userid:code',
        function(req, res) {

        });
}

function sendMail(foundUser) {
    transporter.sendMail({
        from: 'jetcarq@gmail.com',
        to: 'jetcarq@gmail.com',
        subject: 'hello world!',
        html: '<a href="http://localhost:3000/account/login?userid=' + foundUser.id + '&code=' +
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