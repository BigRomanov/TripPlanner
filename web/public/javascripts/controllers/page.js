define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'async',
    'models/pageModel'
  ],
  function($, tripApp, async) {
    'use strict';

    var PageController = function($scope, $route, $routeParams, $http, $modal, $location,pageModel) {

      $scope.gridsterOpts = {
        columns: 4, // the width of the grid, in columns
        width:'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: '220', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: '290', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        padding: 0,
        isMobile: false, // stacks the grid items if true
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        defaultSizeX: 1, // the default width of a gridster item, if not specifed
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
           stop: function(event, uiWidget, $element) { reflow() } // optional callback fired when item is finished dragging
        }
      };

      //truncate opts
      $scope.numChars = 20;
      $scope.numWords = 5;
      $scope.breakOnWord = false;

      $scope.newItem   = { url  : "" };

      if ($routeParams.id == 'new')
      {
        pageModel.createPage(function(err, page) {
          $scope.page = page;
          $location.url('pages/'+page._id);
          
          //$scope.newpage = true;
        });
      }
      else {
        pageModel.loadPage($routeParams.id, function(err, page) {
          if (!page.title) {
            page.title = "Set page title";
          }
          async.each(page.items, 
          function(item, callback) {
            item.pageId = page._id;
            item.regular = true;
            getOrientation(item, callback);
          }, 
          function(err) {
            if (err) {
              console.log("Some error occured when calculating orientation", err);
            }
            $scope.page = page;

            $scope.page.items = _.sortBy($scope.page.items, function(item) {return item.order});

          });
        })
      }

      function reflow(callback) {
        if (callback)
          callback(null);
        return;
        var items = $scope.page.items;
        var nColumns = $scope.gridsterOpts.columns;

        console.log("reflow.................... columns = ", nColumns);

        _.each(items, function(item) { item.aPos = item.row*4 + item.col; });

        var sortedItems = _.sortBy(items, function(item) {return item.aPos});

        var nextRow = 0;
        var nextCol = 0;

        // asuming item.sizeX can not be more  then nColumns

        for (var i = 0; i < sortedItems.length; i++)
        {
          var item = sortedItems[i];
          console.log("aPos",item.aPos, "Row: ", item.row, "Column:", item.col, "sizeX", item.sizeX, "Order:", item.order, "Id", item._id);
          console.log("nextRow", nextRow, "nextCol", nextCol);

          item.newOrder = i; // update order index

          if (nextCol + item.sizeX > 4) { // overflow on current item
            nextCol = 0;
            nextRow = nextRow + 1;
          }

          item.row = nextRow;
          item.col = nextCol;

          nextCol = nextCol + item.sizeX;
          
        }

        var updateItems = _.filter(sortedItems, function(item) {
          if (item.order != item.newOrder) {
            item.order = item.newOrder;
            return true;
          }
          else {
            return false;
          }
        });
        console.log("Items to update:", updateItems);

        pageModel.updateItems(updateItems, function(err, data) {
          if (callback)
            callback(err);
        });
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
              $scope.newItem.url = ""
              return $scope.newItem.url;
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
          var newItem = {
            pageId:$scope.page._id, 
            url:$scope.newItem.url, 
            loading:true,
            regular:true
          };

          var index = calculateNewItemIndex();
          $scope.page.items[index] = newItem;  

          pageModel.createItem(newItem, function(err, item) {
            // TODO: Consider refactoring to preloadItem
            item.pageId = $scope.page._id;
            item.regular = true;
            getOrientation(item, function(err) {
              if (err)
                console.log(err)
              
              $scope.page.items[index] = item;                

              reflow(); 
            });
          });
        }
      }

      $scope.deleteItem = function(item) {
        var itemId = item._id;
        console.log("Deleting item: ", itemId);

        pageModel.deleteItem(item.pageId, itemId, function(err, item) {
          if (err)
            console.log(err);

          for(var i = 0; i < $scope.page.items.length; i++) {
            if (itemId == $scope.page.items[i]._id) {
              $scope.page.items.splice(i,1);
              reflow();
              return;
            }
          }
        });
      }

      $scope.changeWidth = function(item) {
        item.sizeX = ((item.sizeX ) % 4 ) + 1;
        item.pageId =  $scope.page._id;

        pageModel.updateItem(item, function(err, item) {
          if (err)
            console.log(err);
          reflow();
        });
      }

      // ///////////////////////////////////////////////

      function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
      }

      var UserEmailCtrl = function ($scope, $modalInstance) {
        $scope.user = {'email' : "" } ;

        $scope.ok = function () {
          if (validateEmail($scope.user.email)) {
            $modalInstance.close($scope.user.email);  
          }
          else
          {
            $scope.message = "Invalid email, please correct"
          }
          
        };

        $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
        };
      };

      $scope.updatePageTitle = function() {
        console.log("New page title: ", $scope.page.title);
        pageModel.updatePage($scope.page, function(err, page) {
          if (err) {
            console.log("Error while updating page", err);
          }          
        });
      }

      $scope.savePage = function() {
        // Request user email
        var modalInstance = $modal.open({
          templateUrl: 'angular/useremail',
          controller: UserEmailCtrl,
        });

        modalInstance.result.then(function (email) {
          console.log("Send permalink to: ", email);
          pageModel.savePage($scope.page._id, email, function(err, page) {
            console.log("Page saved with permalink for user: ", email)
           $scope.message = "Page saved!";
          });
        }, function () {
          // think about something to do here
        });
      }
    };
    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', '$location', 'pageModel', PageController]);

  });