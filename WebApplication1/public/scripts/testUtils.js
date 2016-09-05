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
            if (method === 'DELETE') {
                if (url.indexOf('api/records') === 0) {
                    var id = parseInt(url.split('/')[2]);
                    var recordIndex = records.findIndex(function(item) {
                        return item.id === id;
                    });
                    if (recordIndex > -1) {
                        records.splice(recordIndex, 1);
                        return new responce();
                    }
                    else {
                        throw 'invalid id: ' + id;
                    }
                }
                else if (url.indexOf('api/groups') === 0) {
                    var id = parseInt(url.split('/')[2]);
                    var recordIndex = groups.findIndex(function (item) {
                        return item.id === id;
                    });
                    if (recordIndex > -1) {
                        groups.splice(recordIndex, 1);
                        return new responce();
                    }
                    else {
                        throw 'invalid id: ' + id;
                    }
                }
                else
                    if (url.indexOf('api/sequences') === 0) {
                        var id = parseInt(url.split('/')[2]);
                        var recordIndex = sequences.findIndex(function (item) {
                            return item.id === id;
                        });
                        if (recordIndex > -1) {
                            sequences.splice(recordIndex, 1);
                            return new responce();
                        }

                        else {
                            throw 'invalid id: ' + id;
                        }
                    }
            }
            else if (method === 'POST') {
                var args = json;
                if (url === 'api/records') {
                    if (args.id) {
                        var recordIndex = records.findIndex(function(item) {
                            return item.id === args.id;
                        });
                        records.splice(recordIndex, 1);
                    } else {
                        recordLastId += Math.round(Math.random(100));
                        args.id = recordLastId;
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
                        groupId += Math.round(Math.random(100));
                        args.id = groupId;
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
                        sequenceid += Math.round(Math.random(100));
                        args.id = sequenceid;
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
        'records': this.records,
        'groups': this.groups,
        'sequences': this.sequences,
        'get': function (url, args) {
            return core.ajax('GET', url, args);
        },
        'post': function (url, args) {
            return core.ajax('POST', url, args);
        },
        'createGroup': function (name, amount, time) {
            var item = {};
            core.ajax('POST', 'api/groups', ({ name: name, amount: amount, time: time })).then(function (data) {
                item = data.data;
            });
            return item;
        },
        'createRecord': function (name,amount,paid,time,groupid) {
            var item = {};
            core.ajax('POST', 'api/records', ({name : name,amount:amount,paid:paid,time:time,groupid:groupid})).then(function (data) {
                item = data.data;
            });
            return item;
        },
        'createSequence': function (name, amount, time,group) {
            var item = {};
            core.ajax('POST', 'api/sequences', ({ name: name, amount: amount, time: time,group:group })).then(function (data) {
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