/**
 * Created by raul on 8/21/14.
 */
'use strict';
var zidecoPocStates = angular.module('zideco.pocs.uistates', ['ui.router', 'zideco.pocs.loading']);


zidecoPocStates.config(['$stateProvider', function ($stateProvider) {

   $stateProvider
      .state('pocs', {
         url: '/pocs',
         templateUrl: 'pocs/pocs.html',
         abstract: true,
         // controller: 'pocCtrl'

      })
     .state('pocs.uigrid', {
       url: '/uigrid',
       templateUrl: 'pocs/poc-uigrid.html',
       controller: 'pocCtrl'
     })
     .state('pocs.message', {
       url: '/message',
       templateUrl: 'pocs/poc-message.html',
       controller: 'pocCtrl'

     })


     .state('pocs.facebook', {
       url: '/facebook',
       templateUrl: 'pocs/poc-facebook.html',
       controller: 'pocCtrl'

     })
     .state('pocsfileupload', {
       url: '/pocsfileupload',
       templateUrl: 'pocs/poc-fileupload.html',
       controller: 'pocCtrl'
     })

     .state('pocs.loading', {
       url: '/loading',
       templateUrl: 'pocs/poc-loading.html',
       controller: 'pocLoadingCtrl'
     })
   ;


}]);




