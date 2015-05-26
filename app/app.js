'use strict';
angular.module('zideco', [
    'ui.router',
    'templates',
    'ui.bootstrap',
    // 'ui.gravatar',
    'restangular',
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

// //RESTANGULAR configuration
// .config(['RestangularProvider', 'CONFIG', function(RestangularProvider, CONFIG) {
//     RestangularProvider.setBaseUrl(CONFIG.RestangularBaseUrl);
// }])

.run(['$rootScope',
    '$location',
    'Restangular',
    '$state',
    '$stateParams',
    'LASTURL',
    'ZModuleservice',
    'loadingservice',
    'CONFIG',
    'zidecoEvents',
    'Auth',
    function($rootScope, $location, Restangular, $state, $stateParams, LASTURL, ZModuleservice, loadingservice, CONFIG, zidecoEvents, Auth) {

        //Set some configuration details based on current location.
        var host = $location.host();
        CONFIG.host = host;
        CONFIG.rootPath = $location.path();
        CONFIG.BackendBaseUrl = CONFIG.BackendProtocol + '://' + host + CONFIG.BackendPort + '/' + CONFIG.BackendBasePath;

        //Sconfigure Restangular here because we need location information that is not available on ".config"
        Restangular.setBaseUrl(CONFIG.BackendBaseUrl);


        // It's very handy to add references to $state and $stateParams to the $rootScope
        // so that you can access them from any scope within your applications.For example,
        // <li ui-sref-active="active }"> will set the <li> // to active whenever
        // 'contacts.list' or one of its decendents is active.
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;

        $rootScope.$on(zidecoEvents.zevtAuthLoginatChanged, function(ev, data) {
            //For the loginatChanged event to fire, it means there was an unathourized use attempt.
            //Set logintURL and change state to landing page.
            console.log('in rootscope AuthLoginAtChanged... data: ' + data);
            //At this point, we should set the last attempted url.
            // LASTURL.setLoginError();
            Auth.setLoginAtURL(data);
            $state.go('zideco.landing');
        });


        //Here we store the "last" state. No interceptor, eu incluo informacao de erro (caso aja)
        //Então, abaixo, posso verificar esta informação e se houver, eu sei que devo redirecionar para o "ultimo" após o erro.
        $rootScope.$on('$stateChangeStart',
            //Full signature: event, toState, toParams, fromState, fromParams
            function(event, toState) {
                console.log('in $stateChangeStart. toState: ' + toState.name);

                // var lastUrl = LASTURL.getLastUrl();
                // if (lastUrl && lastUrl.err && lastUrl.state) {
                //     LASTURL.clearLastUrl();
                //     //Redirect to lasturl.
                //     event.preventDefault();
                //     $state.transitionTo(lastUrl.state);
                // }

            });

        $rootScope.$on('$stateChangeSuccess',
            //Full signature: event, toState, toParams, fromState, fromParams
            function(event, toState) {
                console.log('in $stateChangeSuccess. toState: ' + toState.name);
                ZModuleservice.setCurrentModule(toState.name);
                // var lastUrl = LASTURL.getLastUrl();
                //If the lastUrl has an "error" property, than we should not reset it.
                LASTURL.setLastUrl({
                    state: toState.name
                });

            });

        $rootScope.$on('$stateChangeError',
            //Full signature: event, toState, toParams, fromState, fromParams
            function(event, toState) {
                console.log('in $stateChangeError. toState: ' + toState.name);
                ZModuleservice.setCurrentModule(toState.name);
            });



    }
])

.config(function(localStorageServiceProvider) {
    //Vamos usar localStorage para permitir compartilhamento entre abas.
    localStorageServiceProvider
        .setPrefix('ziw')
        .setStorageType('localStorage')
        .setNotify(true, true);
})





//Configure some defaults for HTTP service
.config(['$httpProvider', function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;
}])


.config(['$httpProvider', function($httpProvider) {
        //Inlcui interceptores aqui. Eles são definidos no moldulo de servico (service)
        $httpProvider.interceptors.push('Interceptors');
    }])
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
