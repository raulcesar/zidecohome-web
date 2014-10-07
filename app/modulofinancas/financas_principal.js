/**
 * Created by raul on 05/06/14.
 */
var zidecoFinancas = angular.module('zideco.financas', [
    'zideco.financas.uistates',
    'zideco.financas.reposervices',
    'ui.grid',
    'ui.grid.autoResize'
]);


zidecoFinancas.controller('financasCtrlMain', ['$scope', function ($scope) {
    //Por enquanto nada aqui...
    $scope.lang = 'pt-br';
    $scope.gridOptions = {
//        enableFiltering: true,
        data: [
            {name: 'raul', ponto: '6486'},
            {name: 'faa', ponto: 'foo'},
            {name: 'fee', ponto: 'fi'},
            {name: 'fo', ponto: 'fum'},
        ]
    };


}]);