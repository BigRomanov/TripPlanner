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
        pageModel.load(function(page) {
          $scope.page = page;
        })
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });