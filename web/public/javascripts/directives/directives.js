define(
  'directives/directives',
  ['tripApp'],
  function(tripApp) { 'use strict';


    tripApp.directive( 'tripItem', function($compile, $timeout) {

      var template  =

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
        '<div class="itemTitleBackground"> </div>' +
        '<div class="itemTitleWrapper">' +
          '<p class="itemTitle">{{item.title}}</p>' +
          //'<a ng-href="{{item.url}}">{{item.url}}</p>' +
        '</div>' +
        '<div class="itemDescriptionBackground"> </div>' +
        '<div class="itemDescriptionWrapper">' +
          '<p class="itemDescription">hi there. this is some description for test. are you satisfied with what you see here? hi there. this is some description for test. are you satisfied with what you see here? hi there. this is some description for test. are you satisfied with what you see here? hi there. this is some description for test. are you satisfied with what you see here? hi there. this is some description for test. are you satisfied with what you see here? hi there. this is some description for test. are you satisfied with what you see here? this is some description for test. are you satisfied with what you see here?</p>'
        '</div>'

        /*
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
        */

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

  tripApp.directive( 'inlineEditor', function($compile, $timeout) {

  var textTemplate  = '<div>' +
                        '<span  ng-bind="value" ng-click="edit()"></span>'+
                        '<input ng-model="value" ng-blur="done()"></input>' +
                      '</div>';
  
  var urlTemplate   = '<div>' +
                        '<a src="value" ng-bind="value" ng-click="edit()" ></a>'+
                        '<input ng-model="value" ng-blur="done()"></input>' +
                      '</div>';

  return {
    restrict: 'E',
    scope: { 
      value: '=',
      update: '&'
    },
  
    link: function ( $scope, element, attrs ) {
     
      //element.addClass( 'inlineEditor' );

      $scope.editing = false;

      var getTemplate = function(attrs) {
        return 'url' in attrs ? urlTemplate : textTemplate;
      }
      
      // ng-click handler to activate edit-in-place
      $scope.edit = function () {
        console.log("Editing");
        $scope.editing = true;
        element.addClass( 'active' );
        $timeout(function() { 
          $scope.input.focus();
        },0);
      };
      
      $scope.done = function() {
        $scope.editing = false;
        element.removeClass( 'active' );
        $scope.update();
      }

      element.append(getTemplate(attrs)).show();
      $compile(element.contents())($scope);

      $scope.input = $(element).find("input")[0];
    }
  };
});

});