define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


    tripApp.directive( 'tripItem', function($compile, $timeout) {

      var template  =

        '<div class="itemMeta">' +
          '<p>{{item.title}}</p>' +
          //'<a ng-href="{{item.url}}">{{item.url}}</p>' +
        '</div>' +
        '<div class="itemActionsWrapper">' +
          '<div class="itemImageWrapper">' +
            '<img ng-src="{{item.images[0].url}}" class="itemImg"/>' +
            '<ul ng-show="showButtons" class="itemButtonsWrapper">' +
              '<li class="deleteButtonWrapper">' +
                '<img ng-src="../images/trash-2x.png" ng-click="deleteItem(item)" class="itemBtn"></button>' +
              '</li>' +
              '<li class="templateButtonWrapper">' +
                '<img ng-src="../images/chevron-right-2x.png" ng-click="changeWidth(item)" class="itemBtn"></button>' +
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

    tripApp.directive('changeTemplate', function($timeout) {
      return {
        link: function(scope, element, attrs) {
          element.bind('click', function() {
            $timeout(function() {
              scope.item.sizeX = ((scope.item.sizeX ) % 4 ) + 1;
              scope.itemTemplateCounter= ((scope.itemTemplateCounter)%4)+1;
            });
          });
        }
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