//This is the controller for the "main module" of the appliation.
//In a complex application, each module gets its own folder.
var main = angular.module('zideco.maincontrollers', []);

main.controller('mainCtrl', ['$scope', function ($scope) {
    'use strict';
    var user = {'name': 'raul',
        'email':'raul.teixeira@gmail.com'

    };

    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma',
      'Restangular',
      'ui-bootstrap',
      'datejs',
      'ui-router',
      'jquery',
      'angular-webstorage'
    ];


    $scope.loginimg = 'assets/images/Logout.png';

    $scope.pesquisaPessoa = function() {


    };
    $scope.user = user;





  }]);

