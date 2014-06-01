define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


  tripApp.directive( 'tripItem', function($compile, $timeout) {

    // TODO: once used isolated scope - item names should be changed
    var template  =
      '<div style="width:400px;height:200px;border:1px solid;float:left; margin:10px">' +
      '<div style="overflow:hidden;width:195px;height:195px;float:left">' +
      '<img ng-src={{item.imageUrl}}>' +
      '</div>' +
      '<div style="overflow:hidden;width:190px;height:200px;float:right; text-align:center">' +
      '<p> {{item.name}} </p>' +
      '</div>' +
      '</div>';

    return {
      restrict: 'E',
//      scope: {
//        item: '='
//      },
      template: template

    };
  });

});