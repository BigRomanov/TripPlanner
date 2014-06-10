define(
  [
    'angular',
    'angularAnimate',
    'angularGridster',
    'ui-bootstrap'
  ],
  function(angular) {
    'use strict';

    var app = angular.module('tripApp', ['ui.bootstrap', 'bootstrap-tagsinput', 'ngRoute', 'ngTagsInput','ngResource', 'ui.sortable', 'ngAnimate', 'gridster']);

    app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$provide',
      function($routeProvider, $locationProvider, $httpProvider, $provide) {

        // Authorization code from here
        // https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs
        // https://github.com/Anomen/AuthenticationAngularJS/blob/master/public/javascripts/app.js
        //================================================
        // Check if the user is connected
        //================================================
        var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
          // Initialize a new promise
          var deferred = $q.defer();

          // Make an AJAX call to check if the user is logged in
          $http.get('/loggedin').success(function(user){
            // Authenticated
            if (user !== '0')
              $timeout(deferred.resolve, 0);

            // Not Authenticated
            else {
              $rootScope.message = 'You need to log in.';
              $timeout(function(){deferred.reject();}, 0);
              $location.url('/login');
            }
          });

          return deferred.promise;
        };
        //================================================
        
        //================================================
        // Add an interceptor for AJAX errors
        //================================================
        
        $provide.factory('authInterceptor', function($q, $location) {
          return {
            // optional method
            'request': function(config) {
              //console.log('authInterceptor::request', config);
              return config || $q.when(config);
            },
       
            // optional method
           'requestError': function(rejection) {
              // do something on error
              //console.log('authInterceptor::requestError');
              if (canRecover(rejection)) {
                return responseOrNewPromise
              }
              return $q.reject(rejection);
            },

            // optional method
            'response': function(response) {
              // do something on success
              //console.log('authInterceptor::response', response);
              return response || $q.when(response);
            },
       
            // optional method
           'responseError': function(response) {
              // do something on error
              //console.log('authInterceptor::responseError');
              if (response.status === 401)
                //$location.url('/login');
                window.location.replace('/login');
              return $q.reject(response);
            }
          };
        });
       
        $httpProvider.interceptors.push('authInterceptor');

        // Set up angular routing
        $routeProvider.when('/pages/:id', {
          templateUrl: 'angular/page',
          controller: 'pageController'
        });

        $routeProvider.when('/home', {
          templateUrl: 'angular/home',
          controller: 'homeController'
        });

        $routeProvider.when('/login', {
          templateUrl: 'angular/login',
          controller: 'loginController'
        });

        $routeProvider.when('/admin', {
          templateUrl: 'angular/admin',
          controller: 'adminController'
        });

        $routeProvider.when('/test', {
          templateUrl: 'angular/test',
          controller: 'testController'
        });


        $routeProvider.otherwise({
          redirectTo: '/home'
        });
      }
    ]);
    return app;
  });