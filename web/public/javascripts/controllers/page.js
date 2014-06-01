define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'models/pageModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $route, $routeParams, $http, $modal, pageModel, itemModel) {
      $scope.addingItem = false;

      if ($routeParams.id == 'new')
      {
        console.log("Create new page");
        pageModel.create(function(page) {
          $scope.page = page;
        });

        //============load temp page==========
        $http.get('javascripts/temp_page/items/page.json').success(function(data) {
          $scope.page = data;
          console.log("data is " + data);
        })
        //====== done loading temp page ======

      }
      else {
        console.log("Load existing page");
        pageModel.load($routeParams.id, function(page) {
          $scope.page = page;
        })
      }

      $scope.addItem = function(newItemUrl) {
        console.log('Adding new Item',$scope.newItemUrl);
        if (newItemUrl) {
          var newItem = new itemModel();
          newItem.pageId = $scope.page.id;
          newItem.url = $scope.newItemUrl;
          newItem.save(function() {
            $scope.page.items.push(newItem);
          });
        }
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });