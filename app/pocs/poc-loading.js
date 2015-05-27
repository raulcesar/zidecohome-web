/**
 * Created by raul on 05/06/14.
 */
'use strict';

//This is the controller for the "hours module" of the appliation.
angular.module('zideco.pocs.loading', [
    'ui.bootstrap',
    'ui.router',
    'zideco.services',
    'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.filters',
    'zideco.directives',
    'zideco.hours.daydetailcontrollers',
    'zideco.commonmodals'
])


.controller('pocLoadingCtrl', [
    '$scope',
    '$timeout',
    'loadingservice',
    function($scope, $timeout, loadingservice) {

        $scope.test = function() {
            loadingservice.show('poc');
            $timeout(function() {
                loadingservice.hide('poc:');
            }, 2000);

        };




    }
]);
