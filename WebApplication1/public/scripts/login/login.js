'use strict';

angular.module('myApp.login', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'scripts/login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$location', '$http', '$scope', function ($location, $http, $scope) {




        $scope.email = "test@sdg.ee";
        $scope.login = function () {
            $http.post('/api/login', { email: $scope.email });

        }
    }]);