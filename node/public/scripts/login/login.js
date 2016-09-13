'use strict';

angular.module('myApp.login', ['ngRoute'])
    .config([
        '$routeProvider', function($routeProvider) {
            $routeProvider.when('/login', {
                templateUrl: 'scripts/login/login.html',
                controller: 'LoginCtrl'
            });
        }
    ])
    .controller('LoginCtrl', [
        '$location', '$http', '$scope', '$cookies', function($location, $http, $scope, $cookies) {


            $scope.email = $cookies.get('mail');
            $scope.login = function() {
                //$scope.disableButton = true;
                $http.post('/api/login', { email: $scope.email }).then(function(data) {
                    $scope.message = "email sent check mail box";

                });

            }


            $http.get("api/records", { withCredentials: true }).then(function (data) {
                    $location.path("/records");
            });



    }]);