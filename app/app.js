'use strict';
angular.module('zideco', [
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

])

.run(['$rootScope', '$state', '$stateParams', 'LASTURL', 'ZModuleservice',
  function($rootScope, $state, $stateParams, LASTURL, ZModuleservice) {

    // It's very handy to add references to $state and $stateParams to the $rootScope
    // so that you can access them from any scope within your applications.For example,
    // <li ui-sref-active="active }"> will set the <li> // to active whenever
    // 'contacts.list' or one of its decendents is active.
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;



    //Here we store the "last" state. No interceptor, eu incluo informacao de erro (caso aja)
    //Então, abaixo, posso verificar esta informação e se houver, eu sei que devo redirecionar para o "ultimo" após o erro.
    $rootScope.$on('$stateChangeStart',
      //Full signature: event, toState, toParams, fromState, fromParams
      function(event, toState) {

        var lastUrl = LASTURL.getLasturl();
        if (lastUrl && lastUrl.err && lastUrl.state) {
          LASTURL.clearLastUrl();
          //Redirect to lasturl.
          event.preventDefault();
          $state.transitionTo(lastUrl.state);
        }

        LASTURL.setLasturl({
          state: toState.name
        });
      });

    $rootScope.$on('$stateChangeSuccess',
      //Full signature: event, toState, toParams, fromState, fromParams
      function(event, toState) {
        ZModuleservice.setCurrentModule(toState.name);
      });


  }
])

//Configuração do RESTANGULAR;
.config(['RestangularProvider', 'CONFIG', function(RestangularProvider, CONFIG) {
  RestangularProvider.setBaseUrl(CONFIG.RestangularBaseUrl);
}])



//Configuração do servico de HTTP
.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.useXDomain = true;
}])


// .config(['$httpProvider', function($httpProvider) {
//   //Inlcui interceptores aqui. Eles são definidos no moldulo de servico (service)
//   //  $httpProvider.interceptors.push('Interceptors');
// }])
//
//.config(['gravatarServiceProvider', function(gravatarServiceProvider) {
//        gravatarServiceProvider.defaults = {
//            'size'    : 32,
//            'default' : 'mm'  // Mystery man as default for missing avatars
//        };
//
//        // Use https endpoint
//        gravatarServiceProvider.secure = true;
//    }
//])

;
