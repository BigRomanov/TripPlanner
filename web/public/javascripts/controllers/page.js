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

      $scope.gridsterOpts = {
        columns: 4, // the width of the grid, in columns
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: '210', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: '280', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        isMobile: false, // stacks the grid items if true
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        autogrow_cols:true,
        resizable: {
           enabled: false,
           start: function(event, uiWidget, $element) {}, // optional callback fired when resize is started,
           resize: function(event, uiWidget, $element) {}, // optional callback fired when item is resized,
           stop: function(event, uiWidget, $element) {} // optional callback fired when item is finished resizing
        },
        draggable: {
           enabled: true, // whether dragging items is supported
           //handle: '.my-class', // optional selector for resize handle
           start: function(event, uiWidget, $element) {}, // optional callback fired when drag is started,
           drag: function(event, uiWidget, $element) {}, // optional callback fired when item is moved,
           stop: function(event, uiWidget, $element) {} // optional callback fired when item is finished dragging
        }
      };

      $scope.newItem = {url:"test"};
      
      if ($routeParams.id == 'new')
      {
        console.log("Create new page");
        pageModel.createPage(function(err, page) {
          $scope.page = page;
          $scope.newpage = true;

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
        
        if ('orientation' in item || !('images' in item) || item.images.length == 0) {
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

          console.log(item);
          if ('images' in item && item.images.length > 0 && 'url' in item.images[0] &&item.images[0].url ) {
            img.src = item.images[0].url;  
          }
          else {
            item.orientation = 0;
            callback(null);
          }
        }
      }


      var NewItemCtrl = function ($scope, $modalInstance, url) {
        $scope.newItem = {'url' : url};

        $scope.ok = function () {
          $modalInstance.close($scope.newItem);
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };

      $scope.openNewItem = function() {

        var modalInstance = $modal.open({
          templateUrl: 'angular/newitem',
          controller: NewItemCtrl,
          resolve: {
            url: function () {
              return $scope.newItem.Url;
            }
          }
        });

        modalInstance.result.then(function (newItem) {
          // TODO: The newItem in external scope is not really necessary if
          // addItem is called directly from modal
          $scope.newItem = newItem;
          $scope.addItem();
        }, function () {
          // think about something to do here
        });
      }

      function calculateNewItemIndex() {
        var scrollPos = $(document).scrollTop();
        var itemsInLine = Math.floor($("#contentPane").width() / 400);
        var line = Math.floor((scrollPos) / 200);
        var index = Math.min((line+1) * itemsInLine, $scope.page.items.length);
        return index;
      }

      $scope.addItem = function() {
        console.log("Creating new item:", $scope.newItem)
        if ($scope.newItem.url) {
          var newItem = {pageId:$scope.page._id, url:$scope.newItem.url};
          pageModel.createItem(newItem, function(err, item) {
            // TODO: Consider refactoring to preloadItem
            item.pageId = $scope.page._id;
            item.regular = true;
            getOrientation(item, function(err) {
              if (err)
                console.log(err)
              
              var index = calculateNewItemIndex();
              console.log("Add new item at same location", index, item)
              $scope.page.items[index] = item;  
            });
          });
        }
      }

      $scope.deleteItem = function(item) {
        console.log("Deleting item: ", item);
        
        item.pageId =  $scope.page._id,

        pageModel.deleteItem(item, function(err, item) {
          if (err)
            console.log(err);

          for(var i = 0; i < $scope.page.items.length; i++) {
            console.log($scope.page.items[i]);
            if (item.itemId == $scope.page.items[i]._id) {
              $scope.page.items.splice(i,1);
              return;
            }
          }
        });
      }

      $scope.savePage = function() {
        pageModel.savePage($scope.page._id, function(err, page) {
          $scope.message = "Page saved!";
        });
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });