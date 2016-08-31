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


    function error(message) {

        console.log(message);

        $location.path("/login");
    }
    function logError(data) {
        console.log(data);
    }

    function getSequences(data) {
        $scope.sequences = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });

        updateView();
    }
    function getGroups(data) {
        $scope.groups = data.data.map(function (item) {
            item.amount = parseFloat(item.amount);
            item.time = new Date(item.time);
            return item;
        });

    }


    $http.get("api/records", {
        withCredentials: true
    }).then(function (data) {
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





    $scope.prev = function () {
        $scope.currentTime = addMonths($scope.currentTime, -1);
        $scope.currentYear = newValue.getFullYear();
        $scope.currentMonth = newValue.getMonth();

        updateView();
    }

    $scope.current = function () {
        $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
        $scope.currentYear = newValue.getFullYear();
        $scope.currentMonth = newValue.getMonth();

        updateView();
    }

    $scope.next = function () {
        $scope.currentTime = addMonths($scope.currentTime, 1);
        $scope.currentYear = newValue.getFullYear();
        $scope.currentMonth = newValue.getMonth();

        updateView();
    }

    $scope.edit = function () {
        if ($scope.hideEdit === false)
            $scope.hideEdit = true;
        else
            $scope.hideEdit = false;
    }
    $scope.editRecord = function(record,isgroup) {
        $scope.id = record.id;
        $scope.amount = record.amount;
        $scope.name = record.name;
        $scope.time = record.time.getDate();
        $scope.group = isgroup;
        $scope.sequence = record.hasOwnProperty('sequenceid');
        $scope.canDelete = true;
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
        if ($scope.repeat) {
            var sequence = {
                amount: parseInt($scope.amount),
                name: $scope.name,
                userid: "null",
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day),
                group: $scope.group,
            };
            $scope.sequences.push(
                sequence
            );
            $http.post("api/sequences", sequence, {
                withCredentials: true
            }).then(function (item) {
                sequence.id = item.data.id;//hack
            }, logError);

        } else if ($scope.group) {
            var group = {
                amount: parseInt($scope.amount),
                name: $scope.name,
                userid: "null",
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
            };
            $scope.groups.push(group);

            $http.post("api/groups", group, {
                withCredentials: true
            }).then(function (item) {
                group.id = item.data.id;//hack
            }, logError);

        } else {
            var record = {
                amount: parseInt($scope.amount),
                name: $scope.name,
                paid: $scope.paid,
                userid: "null",
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
            };
            $scope.records.push(record);
            $http.post("api/records", record, {
                withCredentials: true
            }).then(function (item) {
                record.id = item.data.id;//hack
            }, logError);

            $scope.amount = null;
            $scope.name = null;
            $scope.paid = false;
            $scope.day = $scope.day;
        }

        updateView();
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
            record.id = item.id;
        }, logError);

        group.recordAmount = '';
        group.recordName = group.name;
        group.recordPaid = false;
        group.recordDay = day;

        updateView();
    }

    $scope.updateView = function () {
        var sequencesWithoutGroups = $scope.sequences.filter(function (item) {
            if (item.group)
                return false;
            return true;
        });
        var recordsWithSequences = processSequences(sequencesWithoutGroups, $scope.records, $scope.currentTime);
        $scope.currentRecords = setCurrentRecords(recordsWithSequences, $scope.currentTime).sort(function (a, b) {
            return a.time > b.time;
        });

        var recordsWithGroups = filterByDate($scope.records, $scope.currentTime, addMonths($scope.currentTime, 1));

        var groupSequences = $scope.sequences.filter(function (item) {
            if (item.group)
                return true;
            return false;
        });
        var groupsWithSequences = processSequences(groupSequences, $scope.groups, $scope.currentTime);
        var currentGroups = filterByDate(groupsWithSequences, $scope.currentTime, addMonths($scope.currentTime, 1));
        currentGroups.map(function (group) {
            group.recordName = group.name;
        });
        $scope.currentGroups = assignRecordsIntoGroups(recordsWithGroups, currentGroups);
        $scope.expectedExpences = calculateExpences($scope.records);
        $scope.currentAmount = calculateCurrent($scope.records);
        $scope.leftAmount = $scope.currentAmount - $scope.expectedExpences;


    }
}
]);




