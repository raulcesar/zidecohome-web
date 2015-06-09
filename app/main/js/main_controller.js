'use strict';

//This is the controller for the "main module" of the appliation.
//In a complex application, each module gets its own folder.
angular.module('zideco.maincontrollers', [
    'zideco.services',
    'ui.router'
])


.controller('mainCtrl', [
    '$scope',
    '$state',
    'ZModuleservice',
    function($scope, $state, ZModuleservice) {


        $scope.isnavbarhidden = true;
        $scope.getLinkUrl = function() {
             return $state.href($scope.currentModule.state);
        };


        $scope.togglenavigationbar = function(visible) {
            $scope.isnavbarhidden = !visible;
        };


        $scope.currentModule = ZModuleservice.getCurrentModule();
        $scope.modules = ZModuleservice.getModulesArray(true);
        $scope.currentModuleUrl = $state.href($scope.currentModule.state);

        //When the current module changes.
        $scope.$on(ZModuleservice.events.evtCurrentModuleChanged, function(event, currentModule) {
            $scope.modules = ZModuleservice.getModulesArray(true);
            $scope.currentModule = currentModule;
            $scope.currentModuleUrl = $state.href($scope.currentModule.state);
            $scope.togglenavigationbar(false);
        });


    }
]);
