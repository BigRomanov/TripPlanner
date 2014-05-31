define(
  'directives/directives',
  ['sharezApp'],
  function(sharezApp) { 'use strict';


  sharezApp.directive( 'inlineEditor', function($compile, $timeout) {

    // TODO: Prefix highlighting is currently hard coded into the editor, we should consider refactoring this
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
      },

      link: function ( $scope, element, attrs ) {

        console.log("Editor");
        element.addClass( 'inlineEditor' );

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
          //$scope.update();
        }

        element.append(getTemplate(attrs)).show();
        $compile(element.contents())($scope);

        $scope.input = $(element).find("input")[0];
      }
    };
  });

});