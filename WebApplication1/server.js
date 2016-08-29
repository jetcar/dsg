var express = require('express');
var path = require('path');


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');




var urlencodedParser = bodyParser.json();

var app = express();


app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.get('/', function (req, res) {
    //res.send(path.join(__dirname ,"/public/index.html"));
    res.sendFile('/', { root: __dirname + '/public' });
});


var loginController = require(__dirname + '/node_controllers/LoginController.js')(app);
var recordsController = require(__dirname + '/node_controllers/RecordsController.js')(app);
var groupsController = require(__dirname + '/node_controllers/GroupsController.js')(app);
var sequencesController = require(__dirname + '/node_controllers/SequencesController.js')(app);




app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
