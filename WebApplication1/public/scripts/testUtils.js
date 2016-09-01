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
        ajax: function (method, url, args) {



            // Instantiates the XMLHttpRequest
            var uri = url;


            if (method === 'GET') {
                if (url === 'api/records')
                    return (new responce({ data: records }));
                else if (url === 'api/groups')
                    return (new responce({ data: groups }));
                else
                    return (new responce({ data: sequences }));
            }
            else if (method === 'POST') {
                if (url === 'api/records') {
                    args.id = ++recordLastId;
                    return (new responce(args));
                }
                else if (url === 'api/groups') {
                    args.id = ++groupId;

                    return (new responce(args));
                } else {
                    args.id = ++sequenceid;

                    return (new responce(args));
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