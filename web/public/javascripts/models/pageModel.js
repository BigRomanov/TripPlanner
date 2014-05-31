console.log("Processing pageModel");

define(
'models/pageModel', [
  'jQuery',
  'underscore',
  'tripApp',
],
function($, _, tripApp, $http) {
  "use strict";


  tripApp.factory('pageModel', function($http) {
    return {
      create: function(callback) {
        $http({
          url: "http://localhost:3000/page/new",
          method: "POST"
        }).success(function(data, status, headers, config) {
            console.log(data);
            callback(data);
        }).error(function(data, status, headers, config) {
          // TODO: Maybe we can get callback here
          //$scope.status = status;
          callback(data);
        });
      },
      load: function(id, callback) {
        $http({
          url: "http://localhost:3000/page/"+ id,
          method: "GET"
        }).success(function(data, status, headers, config) {
            console.log(data);
            callback(data);
        }).error(function(data, status, headers, config) {
          // TODO: Maybe we can get callback here
          //$scope.status = status;
          callback(data);
        });
      }
    }
  });
});