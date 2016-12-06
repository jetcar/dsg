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
        $cookies.put('deviceid', Math.random(), { 'expires': new Date(Date.now() + 1209600000) });
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
    $scope.filter = 10;

    $scope.updateView = function (fromPrevMonth) {
        
        var filteredSequences = filterByDate($scope.sequences, new Date(1970), addMonths($scope.currentTime, 1));
        var filteredRecords = filterByDate($scope.records, $scope.currentTime, addMonths($scope.currentTime, 1));
        var filteredGroups = filterByDate($scope.groups, $scope.currentTime, addMonths($scope.currentTime, 1));

        var recordSequences = filteredSequences.filter(function (item) {
            if (item.group)
                return false;
            return true;
        });

        var recordsNotFromGroup = filteredRecords.filter(function (item) {
            if (item.groupid > 0)
                return false;
            return true;
        });

        var recordsWithSequences = addSequencesToRecords(recordSequences, recordsNotFromGroup, $scope.currentTime);
        $scope.currentRecords = sortRecords(recordsWithSequences, $scope.currentTime);

        var groupSequences = $scope.sequences.filter(function (item) {
            if (item.group)
                return true;
            return false;
        });


        var currentGroups = addSequencesToRecords(groupSequences, filteredGroups, $scope.currentTime);

        var sortedGroups = currentGroups.sort(function(a, b) {

            if (a.time - b.time === 0) {
                return a.name.localeCompare(b.name);
            }
            return b.time - a.time;
        });

        var recordsInsideGroups = filteredRecords.filter(function (item) {
            if (item.groupid > 0)
                return true;
            return false;
        });

        assignRecordsIntoGroups(recordsInsideGroups, sortedGroups);

        for (var i = 0; i < sortedGroups.length; i++) {
            sortedGroups[i].records = sortRecords(sortedGroups[i].records);
        }

        $scope.currentGroups = sortedGroups;


        if (fromPrevMonth) {
            $scope.currentRecords.push(fromPrevMonth);
        }

        var expectedExpences = calculateExpences($scope.currentRecords, $scope.currentGroups);
        $scope.currentAmount = calculateCurrent($scope.currentRecords, $scope.currentGroups);
        
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


    var recordsget = $http.get("api/records", { withCredentials: true });
    var recordsResponce = recordsget.then(function (data) {
        $scope.records = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });


    });

    var groupsGet = recordsResponce.then(function () {
        return $http.get("api/groups", {
            withCredentials: true
        });

    });
    var groupsResponce = groupsGet.then(function (data) {
        $scope.groups = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            item.group = true;
            return item;
        });
    });
    var sequenceGet = groupsResponce.then(function () {
        return $http.get("api/sequences", {
            withCredentials: true
        });

    });
    sequenceGet.then(function (data) {
        $scope.sequences = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);//problem here need to convert to local timep
            item.repeat = true;

            return item;
        });

        $scope.updateView();
    })
                  .catch(error);

    $scope.showMore = function () {
        $scope.filter += 10;
    }
    $scope.showMoreInGroup = function (group) {
        group.filter += 10;
    }

    $scope.pay = function (record) {
        $scope.editRecord(record);
        $scope.editableRecord.paid = true;
        $scope.save();
    }

    $scope.prev = function () {
        $scope.currentTime = addMonths($scope.currentTime, -1);
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();
        $scope.filter = 10;

        $scope.updateView();
    }

    $scope.current = function () {
        $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();
        $scope.filter = 10;

        $scope.updateView();
    }

    $scope.next = function () {
        $scope.currentTime = addMonths($scope.currentTime, 1);
        $scope.currentYear = $scope.currentTime.getFullYear();
        $scope.currentMonth = $scope.currentTime.getMonth();
        $scope.filter = 10;

        var record = {
            name: "from prev month",
            amount: -1*calculateLeft($scope.currentRecords, $scope.currentGroups),
            paid: true,
            time: $scope.currentTime

        }

        $scope.updateView(record);
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
        if ($scope.editableRecord.repeat) {
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

        }
        else if ($scope.editableRecord.group) {
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
         
        else {
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
        $scope.sequences = removeItem(sequence, sequences);
        $http.delete("api/sequences/" + sequence.id,
        {
            withCredentials: true
        }).then(function () {
            updateView();
        });
    }

    $scope.clearTextBox = function (group) {
        group.recordName = '';
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
                $scope.sequences = removeItem(sequence.id, $scope.sequences);

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
            }
            $scope.sequences.push(sequence);

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
                $scope.groups = removeItem(group.id, $scope.groups);

            }
            else {
                group = {
                    amount: parseInt($scope.editableRecord.amount),
                    name: $scope.editableRecord.name,
                    userid: "null",
                    group: true,
                    sequenceid: $scope.editableRecord.sequenceid,
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day),
                    repeat: $scope.editableRecord.repeat,
                };
            }
            $scope.groups.push(group);

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
                    groupid: $scope.editableRecord.groupid,
                };

                record.amount = $scope.editableRecord.amount;
                record.name = $scope.editableRecord.name;
                record.paid = $scope.editableRecord.paid;
                record.time = new Date($scope.currentYear, $scope.currentMonth, $scope.editableRecord.day);
                $scope.records = removeItem(record.id, $scope.records);
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
            }
            $scope.records.push(record);

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
    $scope.collapse = function (group) {
        group.visible = false;
    }
    $scope.expand = function (group) {
        group.visible = true;
        group.filter = 10;
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
                $scope.saveRecord(group, $scope.currentYear, $scope.currentMonth, group.recordDay);
            }, logError);
        } else {
            $scope.saveRecord(group, $scope.currentYear, $scope.currentMonth, group.recordDay);
        }


    }

    $scope.saveRecord = function (group, currentYear, currentMonth, day) {
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




