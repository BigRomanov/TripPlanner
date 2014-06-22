define(
  'models/adminService', [
    'jQuery',
    'underscore',
    'tripApp',
    'models/pageModel'
  ],
  function($, _, tripApp, $http, pageModel) {
    "use strict";

    tripApp.factory('adminService', function($http, pageModel) {
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
        },
        deleteItem : function(pageId, itemId, callback) {
          pageModel.deleteItem(pageId, itemId, callback);
        },
        deletePage : function(pageId, callback) {
          pageModel.deletePage(pageId, callback);
        }
      }

      return AdminService;
    });
  });