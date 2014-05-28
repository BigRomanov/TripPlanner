define(
  'controllers/page', [
    'jQuery',
    'tripApp',
    'models/pageModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $filter, $modal, pageModel) {

    };

    tripApp.controller('pageController', ['$scope', '$filter', '$modal', 'pageModel', PageController]);

  });