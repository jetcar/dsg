var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



var transporter = nodemailer.createTransport(smtpTransport({
                                                               port: 25,
                                                               host: 'localhost',
                                                               tls: {
                                                                   ciphers: 'SSLv3'
                                                               },
                                                               secure: false,
                                                           }));

module.exports = function () {
    return transporter;
}