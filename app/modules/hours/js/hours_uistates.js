/**
 * Created by raul on 4/30/14.
 */

'use strict';

angular.module('zideco.hours.uistates', ['ui.router', 'zideco.services'])

.config(['$stateProvider', 'ZModuleserviceProvider', function($stateProvider, ZModuleserviceProvider) {
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours', 'hours');
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours.currentmonth', 'hours');
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours.daydetail', 'hours');
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours.daydetail.timeentrydetail', 'hours');
    ZModuleserviceProvider.registerStateToModuleRelation('zideco.hours.daydetail.timeperioddetail', 'hours');
    


    $stateProvider
        .state('zideco.hours', {
            url: '/hours',
            abstract: true,
            templateUrl: 'modules/hours/views/hours_main.html',
            data: {
                moduleName: 'Hours'
            },
            // controller: 'hoursCtrlMain'
        })

        .state('zideco.hours.currentmonth', {
            url: '/currentmonth',
            templateUrl: 'modules/hours/views/hours_currentmonth.html',
            data: {
                moduleName: 'Hours'
            },
            controller: 'hoursCtrlMain'
        })

        .state('zideco.hours.daydetail', {
            url: '/daydetail/:day',
            templateUrl: 'modules/hours/views/hours_day_detail.html',
            data: {
                moduleName: 'Hours'
            },
            controller: 'hoursDayDetailCtrl'
        })

        .state('zideco.hours.daydetail.timeentrydetail', {
            url: '/te/:entryid',
            templateUrl: 'modules/hours/views/hours_timeentry_entryform.html',
            data: {
                moduleName: 'Hours'
            },
            controller: 'timeEntryDetailCtrl'
        })

        .state('zideco.hours.daydetail.timeperioddetail', {
            url: '/tp/:periodid',
            templateUrl: 'modules/hours/views/hours_timeperiod_entryform.html',
            data: {
                moduleName: 'Hours'
            },
            controller: 'timePeriodDetailCtrl'
        })


    //    .state('pessoatestes', {
    //      url: '/pessoatestes',
    //      templateUrl: 'modulopessoas/TesteSidebar.html',
    //      controller: 'pessoasCtrlMain'
    //    })

    ;
}]);
