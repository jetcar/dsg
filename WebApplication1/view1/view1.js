'use strict';
angular.module('myApp.view1', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}
]);
app.controller('View1Ctrl', ['$scope','$http','$location', function ($scope,$http,$location) {

    var records = [];
    $http.get("api/records",{withCredentials : true}).then(function (data) {
        records = data;
    },function (error) {
        $location.path( "/view2" );

    });
    var groups = [{
        id: 1,
        amount: 100,
        name: "ddd",
        time: new Date()
    }, {
        id: 2,
        amount: 100,
        name: "zp",
        time: new Date()
    },];

    var sequences = [
        {
            id: 1,
            amount: 10,
            name: "eda",
            time: new Date()

        },
        {
            id: 2,
            amount: 100,
            name: "edagroup",
            time: new Date(),
            group:true,
        },
    ]

    var date = new Date();
    $scope.currentTime = new Date(date.getFullYear(), date.getMonth());
    $scope.currentYear = $scope.currentTime.getFullYear();
    $scope.currentMonth = $scope.currentTime.getMonth();
    $scope.day = $scope.currentTime.getDate();
    $scope.hideEdit = true;
    $scope.amount = 0;
    $scope.currentRecords = [];
    $scope.expectedExpences = 0;
    $scope.currentAmount = 0;
    $scope.leftAmount = 0;

    $scope.$watch('currentRecords', function (newValue, oldValue) {
        var recordsWithGroups = filterByDate(records, $scope.currentTime, addMonths($scope.currentTime, 1));

        var groupSequences = sequences.filter(function (item) {
            if(item.group)
                return true;
            return false;
        });
        var groupsWithSequences = processSequences(groupSequences,groups,$scope.currentTime);
        var currentGroups = filterByDate(groupsWithSequences, $scope.currentTime, addMonths($scope.currentTime, 1));
        $scope.currentGroups = assignRecordsIntoGroups(recordsWithGroups, currentGroups);
        $scope.expectedExpences = calculateExpences(newValue);
        $scope.currentAmount = calculateCurrent(newValue);
        $scope.leftAmount = $scope.currentAmount - $scope.expectedExpences;

    });

    $scope.$watch('currentTime', function (newValue, oldValue) {
        $scope.currentYear = newValue.getFullYear();
        $scope.currentMonth = newValue.getMonth();

    });

    UpdateView();

    $scope.prev = function () {
        $scope.currentTime = addMonths($scope.currentTime, -1);

        UpdateView();
    }

    $scope.current = function () {
        $scope.currentTime = new Date(date.getFullYear(), date.getMonth());

        UpdateView();
    }

    $scope.next = function () {
        $scope.currentTime = addMonths($scope.currentTime, 1);

        UpdateView();
    }

    $scope.edit = function () {
        if ($scope.hideEdit == false)
            $scope.hideEdit = true;
        else
            $scope.hideEdit = false;
    }

    $scope.delete = function (record) {
        records = removeItem(record, records);

        UpdateView();
    }

    $scope.showEdit = function (record) {
        record.edit = true;
    }

    $scope.saveRecord = function (record) {
        record.edit = false;

        UpdateView();
    }

    $scope.save = function () {
        if ($scope.repeat) {
            var sequence = {
                amount: parseInt($scope.amount),
                name: $scope.name,
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day),
                group:$scope.group,
            };
            sequences.push(
                sequence
            );
            $http.post("api/sequences",sequence,{withCredentials : true});

        } else if ($scope.group) {
            var group = {
                amount: parseInt($scope.amount),
                name: $scope.name,
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
            };
            groups.push(group);

            $http.post("api/groups",group,{withCredentials : true});

        } else {
            var record ={
                amount: parseInt($scope.amount),
                name: $scope.name,
                paid: $scope.paid,
                time: new Date($scope.currentYear, $scope.currentMonth, $scope.day)
            };
            records.push(record);
            $http.post("api/records",record,{withCredentials : true}).then(function (item) {
                record.id = item.id;
            });

            $scope.amount = 1;
            $scope.name = 'a';
            $scope.paid = false;
            $scope.day = $scope.currentTime.getDate();
        }

        UpdateView();
    }

    $scope.saveFromFroup = function (group) {
        var record ={
            amount: parseInt(group.recordAmount),
            name: group.recordName,
            paid: group.recordPaid,
            time: new Date($scope.currentYear, $scope.currentMonth, group.recordDay),
            groupId: group.id
        };
        records.push(record);
        $http.post("api/records",record,{withCredentials : true}).then(function (item) {
            record.id = item.id;
        });

        group.recordAmount = 1;
        group.recordName = 'a';
        group.recordPaid = false;
        group.recordDay = new Date().getDate();

        UpdateView();

    }
    function UpdateView()
    {
        var sequencesWithoutGroups = sequences.filter(function (item)
        {
           if(item.group)
               return false;
            return true;
        });
        var recordsWithSequences = processSequences(sequencesWithoutGroups, records, $scope.currentTime);
        $scope.currentRecords = setCurrentRecords(recordsWithSequences, $scope.currentTime);

    }
}
]);




