define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'models/pageModel'
  ],
  function($, tripApp) {
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
          $scope.page = page;
        })
      }

      $scope.addItem = function(newItemUrl) {
        console.log('Adding new item',$scope.newItemUrl);
        if (newItemUrl) {
          pageModel.createItem({url:newItemUrl})
          
        }
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });