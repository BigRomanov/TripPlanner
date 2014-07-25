(function(){ 'use strict';

require.config({ 
  baseUrl: '/javascripts',
  paths: {
    underscore: 'lib/underscore.min',
    async : 'lib/async',
    jQuery: 'lib/jquery-2.0.3.min',
    'jQueryui': 'lib/jquery-ui-1.10.4.full',
    angular: 'lib/angular',
    angularRoute: 'lib/angular-route',
    angularResource: 'lib/angular-resource',
    angularAnimate: 'lib/angular-animate',
    bootstrap: 'lib/bootstrap.min',
    angularGridster: 'lib/angular-gridster.min',
    'detect-resize' : 'lib/detect-element-resize',
    'ui-bootstrap': 'lib/ui-bootstrap-custom-tpls-0.6.0-SNAPSHOT.min',
    controllers: 'controllers',
    filters: 'filters',
    models: 'models',
    'bootstrap-tagsinput': 'lib/bootstrap-tagsinput.min',
    'bootstrap-tagsinput-angular': 'lib/bootstrap-tagsinput-angular',
    'ng-tags-input' : 'lib/ng-tags-input',
    sortable : 'lib/sortable',
    angularTruncate: 'lib/truncate'
  },
  shim: {
    'jQuery': {
      exports : 'jQuery'
    },
    'jQueryui': {
      deps: ['jQuery']
    },
    'underscore': {
      exports : '_'
    },
    'async': {
      exports : 'async'
    },
    'angular': {
      deps: ['jQuery'],
      exports : 'angular'
    },
    'angularRoute': {
      deps: ['angular'],
    },
    'angularResource': {
      deps: ['angular'],
    },
    'angularAnimate': {
      deps: ['angular'],
    },
    'bootstrap': {
      deps: ['jQuery'],
      exports : 'bootstrap'
    },
    'ui-bootstrap': {
      deps: ['jQuery','bootstrap', 'angular'],
      exports : 'ui-bootstrap'
    },
    'bootstrap-tagsinput': {
      deps: ['bootstrap']
    },
    'bootstrap-tagsinput-angular': {
      deps: ['bootstrap-tagsinput', 'angular']
    },
    'ng-tags-input' : {
      deps: ['angular']
    },
    'sortable' : {
      deps: ['jQuery', 'jQueryui', 'angular']
    },
    'detect-resize' : {
      deps: ['jQueryui'],
    },
    'angularGridster': {
      deps: ['jQueryui', 'bootstrap', 'angular'],
      exports: 'gridster'
    },
    'angularTruncate': {
      deps: ['angular'],
      exports: 'truncate'
    }
  }
});

require([
  'jQuery', 
  'angular', 
  'angularRoute', 
  'angularResource', 
  'angularAnimate', 
  'angularGridster',
  'angularTruncate',
  'bootstrap', 
  'ui-bootstrap', 
  'bootstrap-tagsinput',
  'bootstrap-tagsinput-angular',
  'ng-tags-input',
  //'filters/filters',
  'directives/directives',
  'sortable',
  'models/pageModel',
  'controllers/home',
  'controllers/page',
  'controllers/admin',
  'controllers/login',], function($, angular) {
    angular.bootstrap(document, ['tripApp']);
  });

})();

