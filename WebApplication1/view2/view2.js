'use strict';

angular.module('myApp.view2', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view2', {
            templateUrl: 'view2/view2.html',
            controller: 'View2Ctrl'
        });
    }])

    .controller('View2Ctrl', ['$location', '$http', '$scope', function ($location, $http, $scope) {

        $scope.email = "test@sdg.ee";
        $scope.login = function () {
            $http.post('/api/login', { email: $scope.email });

        }
    }]);