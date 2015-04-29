'use strict';
var zideco = angular.module('zideco',[
  'ui.router',
  'templates',
  'ui.bootstrap',
  'ui.gravatar',
  'restangular',
  'webStorageModule',
//  'pascalprecht.translate',

  'zideco.filters',
  'zideco.states.main',
  'zideco.envconfig',
  'zideco.services',
  'zideco.directives',
  'zideco.maincontrollers',


  // Modules
  'zideco.finance',
  'zideco.hours',
  'zideco.pocs',
  // 'btford.socket-io'

]);
//  [
//
////
//
//
//
//]);

zideco.run(
  [        '$rootScope', '$state', '$stateParams', 'LASTURL',
    function ($rootScope,   $state,   $stateParams, LASTURL) {

      // It's very handy to add references to $state and $stateParams to the $rootScope
      // so that you can access them from any scope within your applications.For example,
      // <li ui-sref-active="active }"> will set the <li> // to active whenever
      // 'contacts.list' or one of its decendents is active.
      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      //Aqui vou armazenar o "ultimo" estado. No interceptor, eu incluo informacao de erro (caso aja)
      //Então, abaixo, posso verificar esta informação e se houver, eu sei que devo redirecionar para o "ultimo" após o erro.
      $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams){
          var lastUrl = LASTURL.getLasturl()
          if (lastUrl && lastUrl.err && lastUrl.state) {
            LASTURL.clearLastUrl();
            //Redirect to lasturl.
            event.preventDefault();
            $state.transitionTo(lastUrl.state)
          }


          LASTURL.setLasturl({state: toState.name});
        })

    }]);

//Configuração do RESTANGULAR;
zideco.config(['RestangularProvider', 'CONFIG', function (RestangularProvider, CONFIG) {
  RestangularProvider.setBaseUrl(CONFIG.RestangularBaseUrl);
}]);



//Configuração do servico de HTTP
zideco.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.useXDomain = true;
}]);


zideco.config(['$httpProvider', function($httpProvider) {
  //Inlcui interceptores aqui. Eles são definidos no moldulo de servico (service)
//  $httpProvider.interceptors.push('Interceptors');
}]
);



//
//kd.config(['gravatarServiceProvider', function(gravatarServiceProvider) {
//        gravatarServiceProvider.defaults = {
//            'size'    : 32,
//            'default' : 'mm'  // Mystery man as default for missing avatars
//        };
//
//        // Use https endpoint
//        gravatarServiceProvider.secure = true;
//    }
//]);


