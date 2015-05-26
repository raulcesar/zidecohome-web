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

        console.log('charging up main controller');

        $scope.isnavbarhidden = true;



        $scope.togglenavigationbar = function(visible) {
            $scope.isnavbarhidden = !visible;
        };


        $scope.currentModule = ZModuleservice.getCurrentModule();
        $scope.modules = ZModuleservice.getModulesArray(true);

        //When the current module changes.
        $scope.$on(ZModuleservice.events.evtCurrentModuleChanged, function(event, currentModule) {
            $scope.modules = ZModuleservice.getModulesArray(true);
            $scope.currentModule = currentModule;
            $scope.togglenavigationbar(false);
        });


    }
]);
