/**
 * Created by raul on 22/05/2015.
 */
'use strict';

//This is the controller for the 'hours module' of the appliation.
angular.module('zideco.commonmodals', [
        'ui.bootstrap',
        'ui.router',
        'zideco.services',
        // 'zideco.common.reposervices',
        'zideco.hours.reposervices',
        'zideco.filters',
        'zideco.directives',
        'zideco.directives.keypress',
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

            // $scope.ghommis = function() {
            //     $scope.keyDownConfig.push({
            //         mode: 'keydown',
            //         combinations: [{
            //             key: 'c'
            //         }],
            //         bindOn: true,
            //         callback: $scope.closeWithEscape
            //     });
            // };

            $scope.cancel = function() {
                // $scope.keyDownConfig[0].bindOn = false;
                // $scope.keyDownConfig[1].bindOn = false;

                $modalInstance.dismiss();
            };

            $scope.closeWithEscape = function($event) {
                $event.preventDefault();
                $scope.cancel();
            };

            $scope.keyDownConfig = [{
                    mode: 'keydown',
                    combinations: [{
                        // key: 'esc'
                        key: 'enter'
                    }],
                    bindOn: true,
                    callback: $scope.ok
                }

            ];



        }
    ])
    .factory('UsernamePasswordModalService', ['$rootScope', '$modal', function($rootScope, $modal) {
        var getUsernamePasswordModal = function() {
            //Will open modal and return promise 
            return $modal.open({
                templateUrl: 'common/templates/username_password.html',
                controller: 'UsernamePasswordCtrl',
                backdrop: 'static',
                size: 'sm',
                // keyboard: true
            });

        };


        //return API
        return {
            getUsernamePasswordModal: getUsernamePasswordModal
        };
    }])


;
