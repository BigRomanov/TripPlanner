define(
  'models/adminService', [
    'jQuery',
    'underscore',
    'tripApp',
  ],
  function($, _, tripApp, $http) {
    "use strict";

    tripApp.factory('adminService', function($http) {
      var AdminService = {
        allPages: function(callback) {
          $http({
            method: "GET",
            url: "http://localhost:3000/admin/pages"
          }).success(function(data, status, headers, config) {
            console.log("adminService::SUCCESS: Loaded pages", data);
            callback(null, data);
          }).error(function(data, status, headers, config) {
            console.log("adminService::ERROR: Could not load pages", data);
            callback(data);
          });
        },
        deleteAllPages: function(callback) {
          $http({
            method: "DELETE",
            url: "http://localhost:3000/admin/pages"
          }).success(function(data, status, headers, config) {
            console.log("adminService::SUCCESS: Deleted all pages", data);
            callback(null, data);
          }).error(function(data, status, headers, config) {
            console.log("adminService::ERROR: Could not delete all pages", data);
            callback(data);
          });
        }
      }

      return AdminService;
    });
  });