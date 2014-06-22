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
      deletePage: function(pageId, callback) {
        $http({
          method: "DELETE",
          url: "http://localhost:3000/page/"+ pageId
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Loaded page", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not load page", data);  
          callback(data);
        });
      },
      savePage: function(id, callback) {
        $http({
          method: "POST",
          url: "http://localhost:3000/page/"+ id+"/save"
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Saved page", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not save page", data);  
          callback(data);
        });
      },
      createItem: function(item, callback) {
        console.log('Create new item', item);
        $http({
          method: "POST",
          url: "http://localhost:3000/items",
          data: item
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Created item", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not create item", data);  
          callback(data);
        });
      },
      deleteItem: function(pageId, itemId, callback) {
        console.log('Create new item', item);
        $http({
          method: "DELETE",
          url: "http://localhost:3000/item/"+itemId+"?pageId="+pageId
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Deleted item", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not delete item", data);  
          callback(data);
        });
      },
      updateItem: function(item, callback) {
        console.log('Update item', item);
        $http({
          method: "PUT",
          url: "http://localhost:3000/item/"+item._id,
          data: item
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Updated item", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not update item", data);  
          callback(data);
        });
      },
    }

    return PageModel;
  });
});