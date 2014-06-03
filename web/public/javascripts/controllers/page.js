define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'async',
    'models/pageModel'
  ],
  function($, tripApp, async) {
    'use strict';

    var PageController = function($scope, $route, $routeParams, $http, $modal, pageModel) {
      $scope.addingItem = false;

      if ($routeParams.id == 'new')
      {
        console.log("Create new page");
        pageModel.createPage(function(err, page) {
          $scope.page = page;
        });

      }
      else {
        console.log("Load existing page");
        pageModel.loadPage($routeParams.id, function(err, page) {

          async.each(page.items, 
            function(item, callback) {
              getOrientation(item, callback);
            }, 
            function(err){
            // if any of the saves produced an error, err would equal that error
            if (err) {
              console.log("Some error occured when calculating orientation", err);
            }
            
            $scope.page = page;
            $scope.$apply();
          });
          
        })
      }

      function getOrientation(item, callback) {
        var img = new Image();

        img.onload = function(){
          var height = img.height;
          var width = img.width;

          item.orientation = (height > width) ? 1 : 0;

          console.log("Got info for item" + item._id, item.orientation);
          console.log(img.src);
          console.log(height);
          console.log(width);

          callback(null);
        }

        img.src = item.images[0].url;

      }

      $scope.addItem = function() {
        if ($scope.newItemUrl) {
          var newItem = {pageId:$scope.page._id, url:$scope.newItemUrl};
          console.log('Adding new item',newItem);
          pageModel.createItem(newItem, function(err, item) {
            $scope.page.items.push(item);
          });
          
        }
      }

      $scope.deleteItem = function(itemId) {
        var item = {
          pageId: $scope.page._id,
          itemId: itemId
        }

        pageModel.deleteItem(item, function(err, item) {
          // TODO: Check for error
          for(var i = 0; i < $scope.page.items.length; i++) {
            console.log($scope.page.items[i]);
            if (itemId == $scope.page.items[i]._id) {
              $scope.page.items.splice(i,1);
              return;
            }
          }
        });
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });