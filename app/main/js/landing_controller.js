'use strict';

//This is the controller for the "main module" of the appliation.
//In a complex application, each module gets its own folder.
angular.module('zideco.landing.controllers', [
    'zideco.services',
    'zideco.envconfig'
    ])


.controller('landingMainCtrl', [
    '$scope',
    '$state',
    'Auth',
    'LASTURL',
    'CONFIG',


    function($scope, $state, Auth, LASTURL, CONFIG) {
        // zidecoEvents.zevtAuthLoginatChanged
        $scope.loginatUrl = Auth.getLoginAtURL();
        $scope.googleAutologinUrl =  CONFIG.BackendBaseUrl + 'autologingoogle';

        //Check if there is a lastUrl with an errorFlag. If there is, we should clear it and go...
        var lastUrl = LASTURL.getLastUrlBeforeError();
        if (lastUrl) {
            //Clear the lasturl and go to the before error one!
            LASTURL.clearLastUrl();
            $state.go(lastUrl.state);
        }

    }
]);
