define(
  'controllers/admin', [
    'jQuery',
    'tripApp',
    'models/adminService'
  ],
  function($, tripApp) {
    'use strict';

    var AdminController = function($scope, $route, $routeParams, $http, $modal, adminService) {

      // Load all pages for simplified admin
      adminService.allPages(function(err, data) {
        $scope.pages = data['pages'];
      })
    };

    tripApp.controller('adminController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'adminService', AdminController]);

  });