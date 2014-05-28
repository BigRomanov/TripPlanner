define(
  'controllers/location', [
    'jQuery',
    'tripApp',
    // 'models/locationModel',
  ],
  function($, tripApp) {
    'use strict';

    var PageController = function($scope, $filter, $modal, locationModel) {

      locationModel.load(function(locations) {
        console.log(locations);
        $scope.locations = locations;
      }.bind(this));

    };

    tripApp.controller('pageController', ['$scope', '$filter', '$modal', 'locationModel', PageController]);

  });