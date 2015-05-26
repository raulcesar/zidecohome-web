/**
 * Created by raul on 29/04/14.
 */
 'use strict';
angular.module('zideco.states.main', [
    'zideco.services',
    'zideco.maincontrollers',
    'zideco.landing.controllers',
    ])

.config(['$stateProvider', '$urlRouterProvider', 'ZModuleserviceProvider', function($stateProvider, $urlRouterProvider, ZModuleserviceProvider) {
    // var ZModuleservice = ZModuleserviceProvider.$get[1]();
    // ZModuleservice.registerStateToModuleRelation('zideco.landing', 'landing');
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.landing', 'landing');

    //By default, redirect to landing page.
    $urlRouterProvider.otherwise('/zideco/landing');


    $stateProvider
    //Here we bootstrap the zideco web app.
    .state('zideco', {
        url: '/zideco',
        abstract: true,
        // template: '<ui-view/>'
        templateUrl: 'main/views/statemain.html',
        controller: 'mainCtrl'

    })


    .state('zideco.landing', {
        url: '/landing',
        templateUrl: 'main/views/landingpage.html',
        data: {
            moduleName: 'Main'
        },
        controller: 'landingMainCtrl'
    })


    ;
}]);
