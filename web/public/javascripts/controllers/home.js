define(
  'controllers/home', [
    'jQuery',
    'tripApp',
    'models/pageModel'
  ],
  function($, tripApp) {
    'use strict';

    var HomeController = function($scope, $filter, $modal, $location, pageModel) {

      $scope.createNewPage = function() {
        console.log("Create new page");
        pageModel.createPage(function(err, page) {
          $location.url('pages/'+page._id);
        });
      }
    };

    tripApp.controller('homeController', ['$scope', '$filter', '$modal', '$location', 'pageModel', HomeController]);

  });
