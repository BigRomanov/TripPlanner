define(
  'controllers/login', [
    'jQuery',
    'tripApp',
  ],
  function($, tripApp) {
    'use strict';

    var LoginController = function($scope) {

      // This object will be filled by the form
      $scope.user = {};

      // Register the login() function
      $scope.login = function(){
        $http.post('/login', {
          username: $scope.user.username,
          password: $scope.user.password,
        })
        .success(function(user){
          // No error: authentication OK
          $rootScope.message = 'Authentication successful!';
          $location.url('/');
        })
        .error(function(){
          // Error: authentication failed
          $rootScope.message = 'Authentication failed.';
          $location.url('/login');
        });
      };
    }

    tripApp.controller('loginController', ['$scope', '$filter', '$modal', 'locationModel', LoginController]);

  });