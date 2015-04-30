/**
 * Created by raul on 4/30/14.
 */

'use strict';

angular.module('zideco.hours.uistates', ['ui.router', 'zideco.services'])

.config(['$stateProvider', 'ZModuleserviceProvider', function($stateProvider, ZModuleserviceProvider) {
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours', 'hours');

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
