// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$numeraljsConfigProvider',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide , $numeraljsConfigProvider) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
        
        $numeraljsConfigProvider.setDefaultFormat('0,0.00');
        $numeraljsConfigProvider.setCurrentLanguage('fr');
    
    }
  ])
