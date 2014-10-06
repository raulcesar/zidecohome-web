/**
 * Created by raul on 29/04/14.
 */
var zidecoStates = angular.module('zideco.states', []);

zidecoStates.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    'use strict';

    //Por default, redireciona para o statemain
    //Por hora, estou configurando um ponto "

    $urlRouterProvider.otherwise('/zideco');


    $stateProvider
        .state('zideco', {
            url: '/zideco',
            templateUrl: 'main/statemain.html',
            data: {
                moduleName: 'ZIDECO'
            },
            controller: 'mainCtrl'
        })


    ;
}]);
