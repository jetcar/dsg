var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');



var transporter = nodemailer.createTransport(smtpTransport('smtps://jetcarq%40gmail.com:Curev3st1@smtp.gmail.com'));

module.exports = function () {
    return transporter;
}