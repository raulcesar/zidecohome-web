/**
 * Created by raul on 4/30/14.
 */

'use strict';

angular.module('zideco.hours.uistates', ['ui.router'])

.config(['$stateProvider', function($stateProvider) {


    $stateProvider
        .state('zideco.hours', {
            url: '/hours',
            templateUrl: 'modules/hours/views/hours_main.html',
            data: {
                moduleName: 'Hours'
            },
            controller: 'hoursCtrlMain'
        })



    //    .state('pessoatestes', {
    //      url: '/pessoatestes',
    //      templateUrl: 'modulopessoas/TesteSidebar.html',
    //      controller: 'pessoasCtrlMain'
    //    })

    ;
}]);
