'use strict';
angular.module('myApp.records', ['ngRoute']).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/records', {
        templateUrl: 'scripts/records/records.html',
        controller: 'RecordsCtrl'
    });
}
])
.controller('RecordsCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {

    $scope.records = [];
    $scope.groups = [];
    $scope.sequences = [];
    var date = new Date();
    $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
    $scope.currentYear = $scope.currentTime.getFullYear();
    $scope.currentMonth = $scope.currentTime.getMonth();
    $scope.day = date.getDate();
    $scope.hideEdit = true;
    $scope.amount = 0;
    $scope.currentRecords = [];
    $scope.expectedExpences = 0;
    $scope.currentAmount = 0;
    $scope.leftAmount = 0;



    $scope.updateView = function () {
        var sequencesWithoutGroups = $scope.sequences.filter(function (item) {
            if (item.group)
                return false;
            return true;
        });

        var filteredSequences = filterByDate(sequencesWithoutGroups, new Date(1970), addMonths($scope.currentTime, 1));


        var recordsWithSequences = processSequences(filteredSequences, $scope.records, $scope.currentTime);
        $scope.currentRecords = setCurrentRecords(recordsWithSequences, $scope.currentTime).sort(function (a, b) {
            return a.time > b.time;
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
        $scope.currentGroups = assignRecordsIntoGroups(recordsWithGroups, currentGroups);
        if ($scope.currentTime > new Date()) {
            var record = recordWithPrevMonthsMoney(recordsWithSequences,
                $scope.currentGroups,
                $scope.currentTime);
            if (record) {
                $scope.currentRecords.push(record);
            }
        }

        var expectedExpences = calculateExpences($scope.currentRecords, $scope.currentGroups);
        $scope.currentAmount = calculateCurrent($scope.currentRecords, $scope.currentGroups);
        $scope.leftAmount = $scope.currentAmount - expectedExpences;
        if (expectedExpences > 0)
            $scope.expectedExpences = expectedExpences;
        else {
            $scope.expectedExpences = 0;
        }

    }

    function error(message) {

        console.log(message);

        $location.path("/login");
    }

    function getSequences(data) {
        $scope.sequences = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });

        $scope.updateView();
    }
    function getGroups(data) {
        $scope.groups = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });

    }

    $http.get("api/records", { withCredentials: true })
        .then(function (data) {
            $scope.records = data.data.map(function (item) {
                item.amount = parseFloat(item.amount);
                item.time = new Date(item.time);
                return item;
            });


        }, error).then(function () {

            $http.get("api/groups", {
                withCredentials: true
            }).then(getGroups, error);

        }, error).then(function () {
            $http.get("api/sequences", {
                withCredentials: true
            }).then(getSequences, error);

        });


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
        if ($scope.hideEdit === false)
            $scope.hideEdit = true;
        else
            $scope.hideEdit = false;
    }
    $scope.editRecord = function (record, isgroup) {
        $scope.id = record.id;
        $scope.amount = record.amount;
        $scope.name = record.name;
        $scope.time = record.time.getDate();
        $scope.paid = record.paid;
        $scope.group = isgroup;
        $scope.hideEdit = true;
    }
    $scope.editSequence = function (record, isgroup) {
        $scope.id = record.sequence.id;
        $scope.amount = record.amount;
        $scope.name = record.name;
        $scope.time = record.time.getDate();
        $scope.paid = record.paid;
        $scope.group = isgroup;
        $scope.repeat = true;
        $scope.hideEdit = true;
    }

    $scope.delete = function (record) {
        records = removeItem(record, records);
        $http.delete("api/records/" + record.id,
        {
            withCredentials: true
        }).then(function () {
            updateView();
        });
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
        if (!$scope.amount)
            return;
        if (!$scope.name)
            return;
        if ($scope.repeat) {
 
            var sequence = {};

            if ($scope.id) {
                sequence = $scope.sequences.find(function (item) { return item.id === $scope.id });
                sequence.amount = $scope.amount;
                sequence.name = $scope.name;
                sequence.time = new Date($scope.currentYear, $scope.currentMonth, $scope.day);
            }
            else {
                sequence = {
                    amount: parseInt($scope.amount),
                    name: $scope.name,
                    userid: "null",
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
                };
                $scope.sequences.push(
                    sequence
                );
            }

            $http.post("api/sequences", sequence, {
                withCredentials: true
            }).then(function (item) {
                sequence.id = item.data.id;//hack
            }, logError);

        } else if ($scope.group) {

            var group = {};

            if ($scope.id) {
                group = $scope.groups.find(function (item) { return item.id === $scope.id });
                group.amount = $scope.amount;
                group.name = $scope.name;
                group.time = new Date($scope.currentYear, $scope.currentMonth, $scope.day);
            }
            else {
                group = {
                    amount: parseInt($scope.amount),
                    name: $scope.name,
                    userid: "null",
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
                };
                $scope.groups.push(group);
            }

            $http.post("api/groups", group, {
                withCredentials: true
            }).then(function (item) {
                group.id = item.data.id;//hack
            }, logError);

        } else {
            var record = {};

            if ($scope.id) {
                record = $scope.records.find(function (item) { return item.id === $scope.id });
                record.amount = $scope.amount;
                record.name = $scope.name;
                record.paid = $scope.paid;
                record.time = new Date($scope.currentYear, $scope.currentMonth, $scope.day);
            }
            else {
                record = {
                    amount: parseInt($scope.amount),
                    name: $scope.name,
                    paid: $scope.paid,
                    userid: "null",
                    time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
                };
                $scope.records.push(record);
            }
            $http.post("api/records", record, {
                withCredentials: true
            }).then(function (item) {
                record.id = item.data.id;//hack
            }, logError);
           
        }
        $scope.id = undefined;
        $scope.amount = undefined;
        $scope.name = undefined;
        $scope.paid = false;
        $scope.day = $scope.day;
        $scope.updateView();
    }

    $scope.saveFromFroup = function (group) {
        if (!group.id) {

            group.userid = "null";
            if (group.sequence)
                group.sequenceid = group.sequence.id;


            $http.post("api/groups", group, {
                withCredentials: true
            }).then(function (item) {
                group.id = item.data.id;
                $scope.groups.push(group);
                saveRecord(group, $scope.currentYear, $scope.currentMonth, $scope.day);
            }, logError);
        } else {
            saveRecord(group, $scope.currentYear, $scope.currentMonth, $scope.day);
        }


    }

    function saveRecord(group, currentYear, currentMonth, day) {
        var record = {
            amount: parseInt(group.recordAmount),
            name: group.recordName,
            paid: group.recordPaid,
            userid: "null",
            time: new Date(currentYear, currentMonth, group.recordDay),
            groupid: group.id
        };
        $scope.records.push(record);
        $http.post("api/records", record, { withCredentials: true }).then(function (item) {
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




