define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'models/pageModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $route, $routeParams, $http, $modal, pageModel) {
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
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });