var express = require('express');
var path = require('path');


var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var compression = require('compression');


var urlencodedParser = bodyParser.json();

var app = express();
app.use(compression({
    threshold : 0, // or whatever you want the lower threshold to be
    filter    : function(req, res) {
        var ct = res.get('content-type');
        // return `true` for content types that you want to compress,
        // `false` otherwise
        return true;
    }
}));

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

app.use(methodOverride());
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}

function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    } else {
        next(err);
    }
}

function errorHandler(err, req, res, next) {
    res.status(500);
    res.end(err.message);
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});
