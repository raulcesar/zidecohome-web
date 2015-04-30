/**
 * Created by raul on 4/30/14.
 */

'use strict';

angular.module('zideco.finance.uistates', ['ui.router', 'zideco.services'])

.config(['$stateProvider', 'ZModuleserviceProvider', function ($stateProvider, ZModuleserviceProvider) {
  ZModuleserviceProvider.registerStateToModuleRelation('zideco.finance', 'finance');

  $stateProvider
    .state('zideco.finance', {
      url: '/finance',
      templateUrl: 'modules/finance/views/finance_main.html',
          data: {
              moduleName: 'Finance'
          },
      controller: 'financeCtrlMain'
    })



//    .state('pessoatestes', {
//      url: '/pessoatestes',
//      templateUrl: 'modulopessoas/TesteSidebar.html',
//      controller: 'pessoasCtrlMain'
//    })

  ;
}]);


