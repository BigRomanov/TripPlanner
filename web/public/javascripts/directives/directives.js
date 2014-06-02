define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


  tripApp.directive( 'tripItem', function($compile, $timeout) {

    var template  =
      '<div class="page_item" ng-mouseenter="editing=true" ng-mouseleave="editing=false">' +
        '<article class="page_item_content">' +
          //------item header-----
          '<div class="page_item_header">'+
            '<div ng-show="editing" ng-click="deleteItem({itemId:item._id})"> <span>Delete</span></div>' +
          '</div>'+
          //------item body-------
          '<div class="page_item_body">' +
            '<div class="page_item_image_wrap" ng-show="item.images.length > 0">' +
              '<img class="page_item_image" ng-src={{item.images[0].url}}>' +
            '</div>' +
          '</div>' +
          //-----item footer------
          '<div class="page_item_footer">' +
            '<div class="page_item_title">' +
              '<p>' +
                '<a href="{{item.url}}" title="{{item.title}}"> {{item.title}} </p>' +
              '</p>' +
            '</div>' +
          '</div>'+
        '</article>'+
      '</div>'

//      '<div class="page_item" ng-mouseenter="editing=true" ng-mouseleave="editing=false">' +
//        '<div class="page_item_title">' +
//          '<a href="{{item.url}}" title="{{item.url}}"> {{item.title}} </a>' +
//          '<div ng-show="editing" ng-click="deleteItem({itemId:item._id})"> <span>Delete</span></div>' +
//        '</div>' +
//        '<div class="page_item_image" ng-show="item.images.length > 0">' +
//          '<img width=380, height=100, ng-src={{item.images[0].url}}>' +
//        '</div>' +
//      '</div>';


    return {
      restrict: 'E',
      scope: {
        item: '=',
        deleteItem: '&'
      },
      template: template
    };
  });

});