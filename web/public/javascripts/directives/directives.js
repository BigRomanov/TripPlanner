define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


  tripApp.directive( 'tripItem', function($compile, $timeout) {

    // TODO: once used isolated scope - item names should be changed
    var template  =
      '<div class="page_item", style="margin:10px; width:360px">' +
        '<article class="page_item_content">' +
          //'<img class="page_item_image", ng-src={{item.imageUrl}} alt>' +
          '<img class="page_item_image", ng-src="http://s3-eu-west-1.amazonaws.com/jamieoliverprod/_int/rdb2/upload/1076_1_1396364592_lrg.jpg" alt>' +
          '<div class="page_item_title">' +
            '<p>' +
              '<a href="{{item.url}}" title="{{item.title}}"> {{item.title}} </p>' +
            '</p>'
          '</div>' +
        '</article>'+
      '</div>'




//        '<div class="page_item_title">' +
//
//        '</div>' +
//        '<div class="page_item_image">' +
//          '<img ng-src={{item.imageUrl}}>' +
//        '</div>' +
//      '</div>';

    return {
      restrict: 'E',
      scope: {
        item: '='
      },
      template: template

    };
  });

});