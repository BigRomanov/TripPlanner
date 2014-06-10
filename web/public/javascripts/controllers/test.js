define(
  'controllers/test', [
    'jQuery',
    'tripApp',
    'async',
    'models/pageModel'
  ],
  function($, tripApp, async) {
    'use strict';

    var TestController = function($scope, $route, $routeParams, $http, $modal, pageModel) {

      function getOrientation(item, callback) {
        
        if ('orientation' in item) {
          if (item.orientation == 1) {
            item.sizeX = 4;
            item.sizeY = 1;
          }
          else {
            item.sizeX = 2;
            item.sizeY = 1;
          }
          callback(null);
        }
        if (!('images' in item) || item.images.length == 0) {
          
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

      $scope.gridsterOpts = {
        columns: 4, // the width of the grid, in columns
        width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
        colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
        rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
        margins: [10, 10], // the pixel distance between each widget
        isMobile: false, // stacks the grid items if true
        minColumns: 1, // the minimum columns the grid must have
        minRows: 2, // the minimum height of the grid, in rows
        maxRows: 100,
        defaultSizeX: 2, // the default width of a gridster item, if not specifed
        defaultSizeY: 1, // the default height of a gridster item, if not specified
        mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
        resizable: {
           enabled: true,
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

      $scope.standardItems = [
        { sizeX: 2, sizeY: 1, row: 0, col: 0 },
        { sizeX: 2, sizeY: 2, row: 0, col: 2 },
        { sizeX: 1, sizeY: 1, row: 0, col: 4 },
        { sizeX: 1, sizeY: 1, row: 0, col: 5 },
        { sizeX: 2, sizeY: 1, row: 1, col: 0 },
        { sizeX: 1, sizeY: 1, row: 1, col: 4 },
        { sizeX: 1, sizeY: 2, row: 1, col: 5 },
        { sizeX: 1, sizeY: 1, row: 2, col: 0 },
        { sizeX: 2, sizeY: 1, row: 2, col: 1 },
        { sizeX: 1, sizeY: 1, row: 2, col: 3 },
        { sizeX: 1, sizeY: 1, row: 2, col: 4 }
      ];

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
        
      });
    };

    tripApp.controller('testController', ['$scope', '$route', '$routeParams', '$filter', '$modal', 'pageModel',  TestController]);

  });
