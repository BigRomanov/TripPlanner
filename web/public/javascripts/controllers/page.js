define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'models/pageModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $route, $routeParams, $http, $modal, pageModel) {
      $scope.addingItem = false;

      if ($routeParams.id == 'new')
      {
        console.log("Create new page");
        pageModel.create(function(page) {
          $scope.page = page;
        })
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
          $scope.page.items.push({url:newItemUrl});
        }
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });