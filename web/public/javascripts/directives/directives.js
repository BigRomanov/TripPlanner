define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


  tripApp.directive( 'tripItem', function($compile, $timeout) {

    var template  =

      '<div class="itemMeta">' +
        '<p style="font-weight:bold">{{item.title}}</p>' +
        <!--p(ng-if="counter!=0") {{item.url}}-->
      '</div>' +
      '<div class="itemActionsWrapper">' +
        '<div class="itemImageWrapper">' +
          '<img ng-src="{{item.images[0].url}}" class="itemImg"/>' +
          '<ul ng-show="showButtons" class="itemButtonsWrapper">' +
            '<li class="ButtonWrapper">' +
              '<button ng-href="" ng-click="deleteItem(item)" class="itemBtn">X</button>' +
            '</li>' +
            '<li class="ButtonWrapper">' +
              '<button ng-href="" ng-click="click(item)" class="itemBtn">T</button>' +
            '</li>' +
          '</ul>' +
        '</div>' +
      '</div>' +
      '<div class="itemDescriptionWrapper">' +
        '<p>hi there. this is some description for test. are you satisfied with what you see here?</p>'
      '</div>'


    return {
      restrict: 'E',
      template: template
    };
  });

  tripApp.directive('notification', function($timeout){
    return {
      restrict: 'E',
      replace: true,
      scope: {
        message: '='
      },
      template: '<div  class="notification" ng-show="message">{{message}}</div>',
      link: function(scope, element, attrs) {
        $timeout(function(){
          scope.message = "";
        }, 5000);
      }
    }
  });

});