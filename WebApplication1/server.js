var express = require('express');
var path = require('path');


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');




var urlencodedParser = bodyParser.json();

var app = express();


app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    //res.send(path.join(__dirname ,"/public/index.html"));
    res.sendFile('/', { root: __dirname + '/public' });
});


var loginController = require(__dirname + '/node_controllers/LoginController.js')(app);




app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
