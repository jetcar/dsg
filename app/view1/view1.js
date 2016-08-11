'use strict';
angular.module('myApp.view1', ['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}
]);
app.controller('View1Ctrl', ['$scope', function ($scope) {
    var records = [{
        amount: 1,
        name: "ddd",
        paid: true,
        time: new Date(),
        groupId: 1

    }, {
        amount: -100,
        name: "zp",
        paid: true,
        time: new Date(),
    },];
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
    $scope.time = new Date();
    $scope.hideEdit = true;
    $scope.amount = 0;
    var today = new Date();
    $scope.currentMonth = today.getMonth();
    $scope.currentYear = today.getFullYear();
    $scope.currentRecords = [];
    $scope.expectedExpences = 0;
    $scope.currentAmount = 0;
    $scope.leftAmount = 0;
    setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    $scope.prev = function () {
        $scope.currentMonth--;
        if ($scope.currentMonth < 0) {
            $scope.currentYear--;
            $scope.currentMonth = 11;
        }
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }
    $scope.current = function () {
        $scope.currentMonth = today.getMonth();
        $scope.currentYear = today.getFullYear();
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }
    $scope.next = function () {
        $scope.currentMonth++;
        if ($scope.currentMonth > 11) {
            $scope.currentYear++;
            $scope.currentMonth = 0;
        }
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }
    $scope.edit = function () {
        if ($scope.hideEdit == false)
            $scope.hideEdit = true;
        else
            $scope.hideEdit = false;
    }
    $scope.delete = function (record) {
        records = removeItem(record, records);
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }
    $scope.showEdit = function (record) {
        record.edit = true;
    }
    $scope.saveRecord = function (record) {
        record.edit = false;
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }
    $scope.save = function () {
        if ($scope.repeat) {
        } else if ($scope.group) {
            groups.push({
                amount: parseInt($scope.amount),
                name: $scope.name,
                time: $scope.time
            });
        } else {
            records.push({
                amount: parseInt($scope.amount),
                name: $scope.name,
                paid: $scope.paid,
                time: $scope.time
            });
            $scope.amount = 1;
            $scope.name = 'a';
            $scope.paid = false;
            $scope.time = new Date();
        }
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    }

    $scope.saveFromFroup = function (group) {
        var gs = $scope.name;
        records.push({
            amount: parseInt(group.recordAmount),
            name: group.recordName,
            paid: group.recordPaid,
            time: group.recordTime,
            groupId : group.id
        });
        group.recordAmount = 1;
        group.recordName = 'a';
        group.recordPaid = false;
        group.recordTime = new Date();
        setCurrentRecords($scope, filter(records, $scope.currentYear, $scope.currentMonth), filter(groups, $scope.currentYear, $scope.currentMonth));
    
    }
}
]);
function setCurrentRecords($scope, records, groups) {
    $scope.currentRecords = recordsWithoutGroups(records);
    $scope.currentGroups = assignRecordsIntoGroups(records, groups);
    $scope.expectedExpences = calculate($scope.currentRecords);
    $scope.currentAmount = calculateCurrent($scope.currentRecords);
    $scope.leftAmount = $scope.currentAmount - $scope.expectedExpences;
}
function assignRecordsIntoGroups(records, groups) {
    var groupsDict = {};
    for (var i = 0; i < groups.length; i++) {
        groupsDict[groups[i].id] = groups[i];
        groups[i].records = [];
        groups[i].leftAmount = groups[i].amount;
        groups[i].recordTime = new Date();
    }
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].groupId > 0) {

            groupsDict[records[i].groupId].records.push(records[i]);
            if (records[i].paid)
                groupsDict[records[i].groupId].leftAmount -= records[i].amount;
        }
    }
    return groups;
}
function recordsWithoutGroups(records) {
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (!(records[i].groupId > 0))
            result.push(records[i]);
    }
    return result;
}
function calculate(records) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (!records[i].paid)
            result += records[i].amount;
    }
    return result;
}
function calculateCurrent(records) {
    var result = 0;
    for (var i = 0; i < records.length; i++) {
        if (records[i].paid)
            result += (-records[i].amount);
    }
    return result;
}
function removeItem(item, array) {
    var result = [];
    for (var i = 0; i < array.length; i++) {
        if (array[i] != item)
            result.push(array[i]);
    }
    return result;
}
function filter(records, year, month) {
    var result = [];
    for (var i = 0; i < records.length; i++) {
        if (records[i].time.getMonth() == month && records[i].time.getFullYear() == year)
            result.push(records[i]);
    }
    return result;
}
