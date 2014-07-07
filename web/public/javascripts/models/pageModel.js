define(
'models/pageModel', [
  'jQuery',
  'underscore',
  'tripApp',
  'async',
],
function($, _, tripApp, async, $http) {
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
      updatePage: function(page, callback) {
        $http({
          method: "PUT",
          url: "http://localhost:3000/page/" + page._id,
          data: {
            'title':page.title,
          }
        }).success(function(data, status, headers, config) {
          console.log("SUCCESS: Saved page", data);
          callback(null, data);
        }).error(function(data, status, headers, config) {
          console.log("ERROR: Could not save page", data);  
          callback(data);
        });
      },
      savePage: function(id, email, callback) {
        $http({
          method: "POST",
          url: "http://localhost:3000/page/save",
          data: {
            'pageId':id,
            'email' : email
          }
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
      updateItems: function(items, callback) {
        // We might want to optiomize that with a single call at some point
        var self = this;
        async.each(items, 
          function(item, callback) {
            self.updateItem(item, callback);
          }, 
          function(err) {
            if (err) {
              console.log("Some error occured when updating items", err);
            }
          });
      },
    }

    return PageModel;
  });
});