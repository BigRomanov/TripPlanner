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
        // Create new page
        $http.post('/page/new')
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });