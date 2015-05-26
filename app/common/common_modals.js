/**
 * Created by raul on 22/05/2015.
 */
'use strict';

//This is the controller for the 'hours module' of the appliation.
angular.module('zideco.commonmodasl', [
        'ui.bootstrap',
        'ui.router',
        'zideco.services',
        // 'zideco.common.reposervices',
        'zideco.hours.reposervices',
        'zideco.filters',
        // 'zideco.directives',

        'angularGrid'
    ])
    .controller('UsernamePasswordCtrl', [
        '$scope',
        '$modalInstance',
        function($scope, $modalInstance) {
            $scope.username = undefined;
            $scope.password = undefined;

            $scope.ok = function() {
                $modalInstance.close({
                    username: $scope.username,
                    password: $scope.password
                });
            };

            $scope.cancel = function() {
                $modalInstance.dismiss();
            };

        }
    ])
    .factory('UsernamePasswordModalService', ['$rootScope', '$modal', function($rootScope, $modal) {
        var getUsernamePasswordModal = function() {
            //Will open modal and return promise 
            return $modal.open({
                templateUrl: 'common/templates/username_password.html',
                controller: 'UsernamePasswordCtrl',
                backdrop: 'static',
                size: 'lg',
                keyboard: false
            });

        };


        //return API
        return {
            getUsernamePasswordModal: getUsernamePasswordModal
        };
    }])


;
