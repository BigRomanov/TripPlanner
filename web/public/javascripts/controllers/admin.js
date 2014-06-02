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

      $scope.deleteAllPages = function() {
        adminService.deleteAllPages(function(err, data) {
          if (err) {
            alert("Error: unable to delete all pages");
          }
          else {
            alert("All pages deleted");
            $scope.pages = [];
          }
        });
      }

      $scope.deleteItem = function(pageId, itemId) {
         adminService.deleteItem({pageId:pageId, itemId:itemId}, function(err, data) {
          if (err) {
            alert("Error: unable to delete item");
          }
          else {
            adminService.allPages(function(err, data) {
              $scope.pages = data['pages'];
            })
          }
        });
      }
    }

    tripApp.controller('adminController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'adminService', AdminController]);

  });