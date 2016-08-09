'use strict';

angular.module('myApp.view1', ['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view1', {
        templateUrl: 'view1/view1.html',
        controller: 'View1Ctrl'
    });
}]);

app.controller('View1Ctrl', ['$scope', function ($scope) {

    $scope.records = [
        {
            amount: 1,
            name: "ddd",
            paid: true,
            time: new Date()
        }

    ];


    $scope.time = new Date();
    $scope.hideEdit = true;

    var today = new Date();
    $scope.currentMonth =  today.getMonth();
    $scope.currentYear = today.getFullYear();

    $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);



    $scope.prev = function () {
        $scope.currentMonth--;
        if ($scope.currentMonth < 0) {
            $scope.currentYear--;
            $scope.currentMonth = 11;
        }

        $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);
    }
    $scope.current = function () {
        $scope.currentMonth = today.getMonth();
        $scope.currentYear = today.getFullYear();

        $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);
    }
    $scope.next = function () {
        $scope.currentMonth++;
        if ($scope.currentMonth > 11) {
            $scope.currentYear++;
            $scope.currentMonth = 0;
        }

        $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);
    }

    $scope.edit = function () {
        if ($scope.hideEdit == false)
            $scope.hideEdit = true;
        else
            $scope.hideEdit = false;
    }

    $scope.delete = function (record) {

        $scope.records =removeItem(record,$scope.records);
        $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);


    }

    $scope.save = function () {
        $scope.records.push({
            amount: $scope.amount,
            name: $scope.name,
            paid: $scope.paid,
            time: $scope.time
        });
        $scope.amount = '';
        $scope.name = '';
        $scope.paid = '';
        $scope.time = new Date();

        $scope.currentRecords = filter($scope.records, $scope.currentYear, $scope.currentMonth);

    }
}]);

function removeItem(item,array) {
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