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
        .success(function(data) {
          console.log(data)
        }).error(function() {
          // Add error handling
        })
      }
    };

    tripApp.controller('pageController', ['$scope', '$route', '$routeParams', '$http', '$modal', 'pageModel', PageController]);

  });