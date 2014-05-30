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
      load: function(callback) {
        $http({
          url: "http://127.0.0.1:3000/api/conversations",
          method: "GET"
        }).success(function(data, status, headers, config) {
            console.log(data);
            callback(data.conversations);
        }).error(function(data, status, headers, config) {
          // TODO: Maybe we can get callback here
          //$scope.status = status;
          callback(data);
        });
      }
    }
  });
});