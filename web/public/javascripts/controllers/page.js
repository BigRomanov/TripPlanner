define(
  'controllers/location', [
    'jQuery',
    'tripApp',
    'models/pageModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $filter, $modal, pageModel) {

      // locationModel.load(function(locations) {
      //   console.log(locations);
      //   $scope.locations = locations;
      // }.bind(this));

    };

    tripApp.controller('pageController', ['$scope', '$filter', '$modal', 'pageModel', PageController]);

  });