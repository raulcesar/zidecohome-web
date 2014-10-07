/**
 * Created by raul on 4/30/14.
 */

'use strict';

var zidecoFinancasStates = angular.module('zideco.financas.uistates', ['ui.router']);


zidecoFinancasStates.config(['$stateProvider', function ($stateProvider) {


  $stateProvider
    .state('zideco.finance', {
      url: '/finance',
      templateUrl: 'modulofinancas/financasmain.html',
          data: {
              moduleName: 'Finance'
          },
      controller: 'financasCtrlMain'
    })



//    .state('pessoatestes', {
//      url: '/pessoatestes',
//      templateUrl: 'modulopessoas/TesteSidebar.html',
//      controller: 'pessoasCtrlMain'
//    })

  ;
}]);


