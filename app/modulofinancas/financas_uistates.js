/**
 * Created by raul on 05/06/14.
 */
/**
 * Created by raul on 4/30/14.
 */


var zidecoFinancasStates = angular.module('zideco.financas.uistates', []);


zidecoFinancasStates.config(['$stateProvider', function ($stateProvider) {
  'use strict';

  $stateProvider
    .state('financasmain', {
      url: '/financas',
      templateUrl: 'modulofinancas/financasmain.html',
      controller: 'financasCtrlMain'
    })
//    .state('pessoatestes', {
//      url: '/pessoatestes',
//      templateUrl: 'modulopessoas/TesteSidebar.html',
//      controller: 'pessoasCtrlMain'
//    })

  ;
}]);


