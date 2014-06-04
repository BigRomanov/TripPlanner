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

          // Perfrom some preprocessing on the loaded list
          async.each(page.items, 
            function(item, callback) {
              item.pageId = page._id;
              item.regular = true;
              getOrientation(item, callback);
            }, 
            function(err){
            // if any of the saves produced an error, err would equal that error
            if (err) {
              console.log("Some error occured when calculating orientation", err);
            }
            
            $scope.page = page;
          });
          
        })
      }

      function getOrientation(item, callback) {
        
        console.log(item);
        if ('orientation' in item || item.images.length == 0) {
          callback(null);
        }
        else {
          var img = new Image();

          img.onload = function(){
            item.orientation = (img.height > img.width) ? 1 : 0;

            // TODO: Think about sending partial data instead of entire item
            pageModel.updateItem(item, function(err, data) {
              callback(err);
            });

          }

          img.src = item.images[0].url;  
        }
      }

      $scope.newItem = function() {
        var scrollPos = $(document).scrollTop();

        var itemsInLine = Math.floor($("#contentPane").width() / 400);
        var line = Math.floor((scrollPos - 200) / 200);

        var index = (line+1) * itemsInLine;

        $scope.new_item_index = index;
        $scope.page.items.splice(index, 0, {new_item:true});

        console.log(itemsInLine, line, index);
      }

      $scope.closeNewItem = function() {
        $scope.page.items.splice($scope.new_item_index, 1);        
      }

      $scope.addItem = function() {
        if ($scope.newItemUrl) {
          var newItem = {pageId:$scope.page._id, url:$scope.newItemUrl};
          console.log('Adding new item',newItem);
          pageModel.createItem(newItem, function(err, item) {
            console.log("Adding new item2", item);
            getOrientation(item, function(err) {
              $scope.page.items.push(item);
            });
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