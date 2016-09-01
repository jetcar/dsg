function myHttp(initialrecords, initialgroups, initialsequences) {

    this.records = initialrecords;
    this.groups = initialgroups;
    this.sequences = initialsequences;

    // A small example of object
    var records = this.records;
    var groups = this.groups;
    var sequences = this.sequences;
    var recordLastId = 0;
    this.records.map(function (a) {
        if (a.id > recordLastId)
            recordLastId = a.id;
    });
    var groupId = 0;
    this.groups.map(function (a) {
        if (a.id > groupId)
            groupId = a.id;
    });
    var sequenceid = 0;
    this.sequences.map(function (a) {
        if (a.id > sequenceid)
            sequenceid = a.id;
    });
    var core = {

        // Method that performs the ajax request
        ajax: function (method, url, json) {


            if (method === 'GET') {
                if (url === 'api/records')
                    return (new responce({ data: records }));
                else if (url === 'api/groups')
                    return (new responce({ data: groups }));
                else
                    return (new responce({ data: sequences }));
            }
            else if (method === 'POST') {
                var args = JSON.parse(json);

                if (url === 'api/records') {
                    if (args.id) {
                        var recordIndex = records.findIndex(function(item) {
                            return item.id === args.id;
                        });
                        records.splice(recordIndex, 1);
                    } else {
                        args.id = ++recordLastId;
                    }
                    records.push(args);

                    return (new responce({ data: args }));
                }
                else if (url === 'api/groups') {
                    if (args.id) {
                        var recordIndex = groups.findIndex(function (item) {
                            return item.id === args.id;
                        });
                        groups.splice(recordIndex, 1);
                    } else {
                        args.id = ++groupId;
                    }
                    groups.push(args);
                    return (new responce({ data: args }));
                } else {
                    if (args.id) {
                        var recordIndex = sequences.findIndex(function (item) {
                            return item.id === args.id;
                        });
                        sequences.splice(recordIndex, 1);
                    } else {
                        args.id = ++sequenceid;
                    }
                    sequences.push(args);
                    return (new responce({ data: args }));
                }
            }


            console.log(method);
            console.log(url);

        }
    };
    // Adapter pattern
    return {
        'get': function (url, args) {
            return core.ajax('GET', url, args);
        },
        'post': function (url, args) {
            return core.ajax('POST', url, args);
        },
        'createGroup': function (name, amount, time) {
            var item = {};
            core.ajax('POST', 'api/groups', JSON.stringify({ name: name, amount: amount, time: time })).then(function (data) {
                item = data.data;
            });
            return item;
        },
        'createRecord': function (name,amount,paid,time,groupid) {
            var item = {};
            core.ajax('POST', 'api/records', JSON.stringify({name : name,amount:amount,paid:paid,time:time,groupid:groupid})).then(function (data) {
                item = data.data;
            });
            return item;
        },
        'createSequence': function (args) {
            var item = {};
            core.ajax('POST', 'api/sequences', JSON.stringify(args)).then(function (data) {
                item = data.data;
            });
            return item;
        },
        'put': function (url, args) {
            return core.ajax('PUT', url, args);
        },
        'delete': function (url, args) {
            return core.ajax('DELETE', url, args);
        }
    };
};

function responce(initialdata) {

    this.data = initialdata;

    // A small example of object
    var data = this.data;
    var core = {

        // Method that performs the ajax request
        ajax: function (method) {

            method(data);
            return new responce();

        }
    };
    // Adapter pattern
    return {
        'then': function (method) {
            return core.ajax(method);
        },
        'error': function (method) {
            return core.ajax(method);
        }
    };
};