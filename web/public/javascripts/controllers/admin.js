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
      });

      adminService.allUsers(function(err, data) {
        $scope.users = data['users'];
      });

      $scope.go = function ( path ) {
        $location.path( path );
      };

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

      $scope.deletePage = function(pageId) {
        console.log("Delete page id", pageId);
        var r = confirm("Are you sure you want to delete this page?");

        if (r == true) {
          adminService.deletePage(pageId, function(err, data) {
            if (err) {
              alert("Error: unable to delete page");
            }
            else {
              adminService.allPages(function(err, data) {
                $scope.pages = data['pages'];
              })
            }
          });
        } 
      }

      $scope.deleteItem = function(pageId, itemId) {
         adminService.deleteItem(pageId, itemId, function(err, data) {
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