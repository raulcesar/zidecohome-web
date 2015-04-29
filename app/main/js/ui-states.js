/**
 * Created by raul on 29/04/14.
 */
angular.module('zideco.states.main', [])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    'use strict';

    //By default, redirect to landing page.
    $urlRouterProvider.otherwise('/zideco/landing');
    // $urlRouterProvider.otherwise('/zideco');


    $stateProvider
    //Here we bootstrap the zideco web app.
    .state('zideco', {
        url: '/zideco',
        abstract: true,
        // template: '<ui-view/>'
        templateUrl: 'main/views/statemain.html'

    })


    .state('zideco.landing', {
        url: '/landing',
        templateUrl: 'main/views/landingpage.html',
        data: {
            moduleName: 'Main'
        },
        controller: 'mainCtrl'
    })


    ;
}]);
