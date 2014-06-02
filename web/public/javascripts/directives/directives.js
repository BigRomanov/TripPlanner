define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


  tripApp.directive( 'tripItem', function($compile, $timeout) {

    // TODO: once used isolated scope - item names should be changed
    var template  =
      '<div class="page_item">' +
        '<div class="page_item_title">' +
          '<a href="{{item.url}}" title="{{item.url}}"> {{item.title}} </p>' +
        '</div>' +
        '<div class="page_item_image">' +
          '<img ng-src={{item.imageUrl}}>' +
        '</div>' +
      '</div>';

    return {
      restrict: 'E',
      scope: {
        item: '='
      },
      template: template

    };
  });

});