define(
'models/pageModel', [
  'jQuery',
  'underscore',
  'tripApp',
],
function($, _, tripApp, $http) {
  "use strict";


  tripApp.factory('pageModel', function($http) {
    var PageModel =  {
      createPage: function(callback) {
        $http({
          url: "http://localhost:3000/page/new",
          method: "POST"
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Created page", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not create page", data);  
          callback(data);
        });
      },
      loadPage: function(id, callback) {
        $http({
          url: "http://localhost:3000/page/"+ id,
          method: "GET"
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Loaded page", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not load page", data);  
          callback(data);
        });
      },
      createItem: function(item, callback) {
        console.log('Create new item', item);
        $http({
          url: "http://localhost:3000/items",
          method: "POST"
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Created item", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not create item", data);  
          callback(data);
        });
      },
    }

    return PageModel;
  });
});