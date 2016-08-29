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