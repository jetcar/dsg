var express = require('express');
var pg = require('pg');
var path = require('path');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var smtpTransport = require('nodemailer-smtp-transport');


var transporter = nodemailer.createTransport(smtpTransport({
    host: 'localhost',
    port: 255,
    
}));

var urlencodedParser = bodyParser.json();


var app = express();

var connectionString = process.env.DATABASE_URL || 'postgres://postgres:qqqqqq@localhost:5432/dsg';


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    //res.send(path.join(__dirname ,"/public/index.html"));
    res.sendFile('/', { root: __dirname + '/public' });
});


app.post('/api/login', urlencodedParser, function (req, res) {

    var mail = req.body.email;

    var mailOptions = {
        from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
        to: 'bar@blurdybloop.com, baz@blurdybloop.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world 🐴', // plaintext body
        html: '<b>Hello world 🐴</b>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);
    });
});

app.get('/api/records', function (req, res) {

    var results = [];
    var client = new pg.Client(connectionString);
    client.connect();

    var query = client.query("SELECT * FROM records ORDER BY id ASC");

    // Stream results back one row at a time
    query.on('row', function (row) {
        results.push(row);
    });

    // After all data is returned, close connection and return results
    query.on('end', function () {

        res.send(results);
    });


});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
