/**
 * Created by raul on 05/06/14.
 */
'use strict';
angular.module('zideco.finance', [
    'zideco.finance.uistates',
    'zideco.finance.reposervices',
    'ui.grid',
    'ui.grid.autoResize'
])

.controller('financeCtrlMain', ['$scope', function ($scope) {
    //Por enquanto nada aqui...
    $scope.lang = 'pt-br';
    $scope.gridOptions = {
        data: [
            {name: 'raul', ponto: '6486'},
            {name: 'faa', ponto: 'foo'},
            {name: 'fee', ponto: 'fi'},
            {name: 'fo', ponto: 'fum'},
        ]
    };


}]);