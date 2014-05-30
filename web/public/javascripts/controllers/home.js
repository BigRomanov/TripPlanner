define(
  'controllers/home', [
    'jQuery',
    'tripApp',
  ],
  function($, tripApp) {
    'use strict';

    var HomeController = function($scope, $filter, $modal) {
    };

    tripApp.controller('homeController', ['$scope', '$filter', '$modal',  HomeController]);

  });
