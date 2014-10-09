/**
 * Created by raul on 8/21/14.
 */
'use strict';
var zidecoPocStates = angular.module('zideco.pocs.uistates', ['ui.router']);


zidecoPocStates.config(['$stateProvider', function ($stateProvider) {

   $stateProvider
      .state('pocs', {
         url: '/pocs',
         templateUrl: 'pocs/pocs.html',
         controller: 'pocCtrl'

      })
     .state('pocs.uigrid', {
       url: '/uigrid',
       templateUrl: 'pocs/poc-uigrid.html',
       controller: 'pocCtrl'

     })
     .state('pocsfileupload', {
       url: '/pocsfileupload',
       templateUrl: 'pocs/poc-fileupload.html',
       controller: 'pocCtrl'

     })
   ;


}]);




