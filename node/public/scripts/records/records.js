'use strict';
angular.module('myApp.records', ['ngRoute']).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/records', {
        templateUrl: 'scripts/records/records.html',
        controller: 'RecordsCtrl'
    });
}
])
.controller('RecordsCtrl', ['$scope', '$http', '$location', '$cookies', function ($scope, $http, $location, $cookies) {

    var browserId = $cookies.get('deviceid');
    if (!browserId)
        $cookies.put('deviceid', Math.random());
    $scope.records = [];
    $scope.groups = [];
    $scope.sequences = [];
    var date = new Date();
    $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
    $scope.currentYear = $scope.currentTime.getFullYear();
    $scope.currentMonth = $scope.currentTime.getMonth();
    $scope.hideEdit = true;
    $scope.editableRecord = {}
    $scope.editableRecord.day = new Date().getDate();

    $scope.currentRecords = [];
    $scope.expectedExpences = 0;
    $scope.currentAmount = 0;
    $scope.leftAmount = 0;
    $scope.loading = true;


    $scope.updateView = function () {
        var sequencesWithoutGroups = $scope.sequences.filter(function (item) {
            if (item.group)
                return false;
            return true;
        });


        var filteredSequences = filterByDate(sequencesWithoutGroups, new Date(1970), addMonths($scope.currentTime, 1));


        var recordsWithSequences = processSequences(filteredSequences, $scope.records, $scope.currentTime);
        $scope.currentRecords = setCurrentRecords(recordsWithSequences, $scope.currentTime).sort(function (a, b) {
            if (a.id == undefined)
                return 1;

            if (b.id == undefined)
                return -1;

            if (a.sequenceid === b.sequenceid) {
                if (a.id === b.id) {
                    return a.name.localeCompare(b.name);
                }
                return a.id > b.id;
            }
            if (a.sequenceid == undefined && b.sequenceid != undefined)
                return 1;
            if (a.sequenceid != undefined && b.sequenceid == undefined)
                return -1;
            return a.sequenceid - b.sequenceid;
        });

        var recordsWithGroups = filterByDate($scope.records, $scope.currentTime, addMonths($scope.currentTime, 1));

        var groupSequences = $scope.sequences.filter(function (item) {
            if (item.group)
                return true;
            return false;
        });

        var filteredGroupSequences = filterByDate(groupSequences, new Date(1970), addMonths($scope.currentTime, 1));

        var groupsWithSequences = processSequences(filteredGroupSequences, $scope.groups, $scope.currentTime);
        var currentGroups = filterByDate(groupsWithSequences, $scope.currentTime, addMonths($scope.currentTime, 1));
        currentGroups.map(function (group) {
            group.recordName = group.name;
        });

        $scope.currentGroups = assignRecordsIntoGroups(recordsWithGroups, currentGroups).sort(function (a, b) {
            if (a.id == undefined)
                return 1;

            if (b.id == undefined)
                return -1;

            if (a.sequenceid === b.sequenceid) {
                if (a.id === b.id) {
                    return a.name.localeCompare(b.name);
                }
                return a.id > b.id;
            }
            if (a.sequenceid == undefined && b.sequenceid != undefined)
                return 1;
            if (a.sequenceid != undefined && b.sequenceid == undefined)
                return -1;
            return a.sequenceid - b.sequenceid;
        });

        if ($scope.currentTime > new Date()) {
            var record = recordWithPrevMonthsMoney(recordsWithSequences,
                groupsWithSequences,
                $scope.currentTime);
            if (record) {
                $scope.currentRecords.push(record);
            }
        }

        var expectedExpences = calculateExpences($scope.currentRecords, $scope.currentGroups);
        $scope.currentAmount = calculateCurrent($scope.currentRecords, $scope.currentGroups);
                if ($scope.currentTime > new Date()) {
        $scope.currentAmount = calculateCurrentForFuture($scope.currentRecords, $scope.currentGroups);
}
        $scope.leftAmount = calculateLeft($scope.currentRecords, $scope.currentGroups);
        if (expectedExpences > 0)
            $scope.expectedExpences = expectedExpences;
        else {
            $scope.expectedExpences = 0;
        }

        $scope.loading = false;

    }

    function error(message) {

        console.log(message);

        $location.path("/login");
    }

    function getGroups(data) {


    }

    $http.get("api/records", { withCredentials: true })
    .then(function (data) {
        $scope.records = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });


    })
    .then(function () {
        return $http.get("api/groups", {
            withCredentials: true
        });

    })
    .then(function(data)
            {
            $scope.groups = data.data.map(function (item) {
                        item.amount = parseFloat(item.amount);
                        item.time = new Date(item.time);
                        item.group = true;
                        return item;
                    });
            })
    .then(function () {
       return $http.get("api/sequences", {
            withCredentials: true
        })

    })
    .then(function (data) {
                      $scope.sequences = data.data.map(function (item) {
                          item.amount = parseFloat(item.amount);
                          item.time = new Date(item.time);//problem here need to convert to local timep
                          item.repeat = true;

                          return item;
                      });

                      $scope.updateView();
                  })
                  .catch(error);

    $scope.pay = function (record) {
        $scope.editRecord(record);
        $scope.editableRecord.paid = true;
        $scope.save();
    }

    $scope.prev = function () {
        $scope.currentTime = addMonths($scope.currentTime, -1);
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();

        $scope.updateView();
    }

    $scope.current = function () {
        $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();

        $scope.updateView();
    }

    $scope.next = function () {
        $scope.currentTime = addMonths($scope.currentTime, 1);
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();

        $scope.updateView();
    }

    $scope.edit = function () {
        if ($scope.hideEdit === false) {
            $scope.hideEdit = true;
            $scope.editableRecord = {};
            $scope.editableRecord.day = new Date().getDate();

        }
        else
            $scope.hideEdit = false;
    }
    $scope.editRecord = function (record) {
        $scope.hideEdit = false;
        $scope.editableRecord = record;
        $scope.editableRecord.day = record.time.getDate();
    }

    $scope.editSequence = function (record) {
        $scope.editableRecord = $scope.sequences.find(function (item) { return item.id === record.sequence.id; });
        $scope.editableRecord.day = record.time.getDate();

    }

    $scope.delete = function () {
        if ($scope.editableRecord.group) {
            $scope.groups = removeItem($scope.editableRecord.id, $scope.groups);
            $http.delete("api/groups/" + $scope.editableRecord.id,
                {
                    withCredentials: true
                })
                .then(function () {
                    $scope.editableRecord = {};
                    $scope.editableRecord.day = new Date().getDate();
                    $scope.updateView();
                });

        }
        else if ($scope.editableRecord.repeat) {
            if ($scope.editableRecord.sequenceid != undefined) {
                $scope.records = removeItem($scope.editableRecord.id, $scope.records);
                $http.delete("api/records/" + $scope.editableRecord.id,
                    {
                        withCredentials: true
                    })
                    .then(function () {
                        $scope.sequences = removeItem($scope.editableRecord.sequenceid, $scope.sequences);
                        $http.delete("api/sequences/" + $scope.editableRecord.sequenceid,
                            {
                                withCredentials: true
                            })
                            .then(function () {
                                $scope.editableRecord = {};
                                $scope.editableRecord.day = new Date().getDate();

                                $scope.updateView();
                            });
                    });
            } else {


                $scope.sequences = removeItem($scope.editableRecord.id, $scope.sequences);
                $http.delete("api/sequences/" + $scope.editableRecord.id,
                    {
                        withCredentials: true
                    })
                    .then(function () {
                        $scope.editableRecord = {};
                        $scope.editableRecord.day = new Date().getDate();

                        $scope.updateView();
                    });
            }

        } else {
            $scope.records = removeItem($scope.editableRecord.id, $scope.records);
            $http.delete("api/records/" + $scope.editableRecord.id,
                {
                    withCredentials: true
                })
                .then(function () {
                    $scope.editableRecord = {};
                    $scope.editableRecord.day = new Date().getDate();

                    $scope.updateView();
                });
        }
    }


    $scope.deleteSequence = function (sequence) {
        sequences = removeItem(sequence, sequences);
        $http.delete("api/sequences/" + sequence.id,
        {
            withCredentials: true
        }).then(function () {
            updateView();
        });
    }



    $scope.save = function () {
        if (!$scope.editableRecord.amount)
            return;
        if (!$scope.editableRecord.name)
            return;
        if ($scope.editableRecord.repeat && $scope.editableRecord.id !== -1 && $scope.editableRecord.sequenceid == undefined) {

            var sequence = {};

            if ($scope.editableRecord.id) {
                sequence = $scope.sequences.find(function (item) { return item.id === $scope.editableRecord.id });
                sequence = {
                    id: sequence.id,
                    userid: "null",
                    group: $scope.editableRecord.group,
                    repeat: true,
                };
                sequence.amount = $scope.editableRecord.amount;
                sequence.name = $scope.editableRecord.name;
                sequence.time = new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day);
            }
            else {
                sequence = {
                    amount: parseInt($scope.editableRecord.amount),
                    name: $scope.editableRecord.name,
                    userid: "null",
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day),
                    group: $scope.editableRecord.group,
                    repeat: true,
                };
                $scope.sequences.push(
                    sequence
                );
            }

            $http.post("api/sequences", (sequence), {
                withCredentials: true
            }).then(function (item) {
                sequence.id = item.data.id;//hack
            }, logError);

        } else if ($scope.editableRecord.group) {

            var group = {};

            if ($scope.editableRecord.id > 0) {
                group = $scope.groups.find(function (item) { return item.id === $scope.editableRecord.id });
                group = {
                    id: group.id,
                    userid: "null",
                    group: true,
                    sequenceid: $scope.editableRecord.sequenceid,
                    repeat: $scope.editableRecord.repeat,
                };
                group.amount = $scope.editableRecord.amount;
                group.name = $scope.editableRecord.name;
                group.time = new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day);
            }
            else {
                group = {
                    amount: parseInt($scope.editableRecord.amount),
                    name: $scope.editableRecord.name,
                    userid: "null",
                    group: true,
                    sequenceid: $scope.editableRecord.sequenceid,
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day)
                };
                $scope.groups.push(group);
            }

            $http.post("api/groups", (group), {
                withCredentials: true
            }).then(function (item) {
                group.id = item.data.id;//hack
            }, logError);

        } else {
            var record = {};

            if ($scope.editableRecord.id > 0) {
                record = $scope.records.find(function (item) { return item.id === $scope.editableRecord.id });
                record = {
                    id: record.id,
                    userid: "null",
                    sequenceid: $scope.editableRecord.sequenceid,
                    repeat: $scope.editableRecord.repeat,
                };

                record.amount = $scope.editableRecord.amount;
                record.name = $scope.editableRecord.name;
                record.paid = $scope.editableRecord.paid;
                record.time = new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day);
            }
            else {
                record = {
                    amount: parseInt($scope.editableRecord.amount),
                    name: $scope.editableRecord.name,
                    paid: $scope.editableRecord.paid,
                    userid: "null",
                    sequenceid: $scope.editableRecord.sequenceid,
                    repeat: $scope.editableRecord.repeat,
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day)
                };
                $scope.records.push(record);
            }
            $http.post("api/records", (record), {
                withCredentials: true
            }).then(function (item) {
                record.id = item.data.id;//hack
            }, logError);

        }
        $scope.editableRecord = {};
        $scope.editableRecord.day = new Date().getDate();

        $scope.updateView();
    }

    $scope.saveFromFroup = function (group) {
        if (group.id < 0) {

            var newgroup = {
                amount: group.amount,
                name: group.name,
                userid: "null",
                sequenceid: group.sequenceid,
                time: new Date(group.time.getFullYear(), group.time.getMonth(), group.recordDay)

            }

            $http.post("api/groups", (newgroup), {
                withCredentials: true
            }).then(function (item) {
                group.id = item.data.id;
                $scope.groups.push(group);
                saveRecord(group, $scope.currentYear, $scope.currentMonth, group.recordDay);
            }, logError);
        } else {
            saveRecord(group, $scope.currentYear, $scope.currentMonth, group.recordDay);
        }


    }

    function saveRecord(group, currentYear, currentMonth, day) {
        var record = {
            amount: parseInt(group.recordAmount),
            name: group.recordName,
            paid: true,
            userid: "null",
            time: new Date(currentYear, currentMonth, day),
            groupid: group.id
        };
        $scope.records.push(record);
        $http.post("api/records", (record), { withCredentials: true }).then(function (item) {
            record.id = item.data.id;
        }, logError);

        group.recordAmount = '';
        group.recordName = group.name;
        group.recordPaid = false;
        group.recordDay = day;

        $scope.updateView();
    }


}
]);



