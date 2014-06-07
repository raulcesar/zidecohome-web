/**
 * Created by raul on 05/06/14.
 */
/**
 * Created by raul on 23/05/14.
 * Este arquivo implementa os servicoes de pessoas relativos a "repositorio" remoto com base em arquivos locais "mock".
 */
'use strict';
var zidecoFinancasServices = angular.module('zideco.financas.reposervices', [])
  .constant('version', '0.0.1');

zidecoFinancasServices.factory('contaResourceService', ['$http', '$q', function ($http, $q) {
  var getContas = function () {
    //Aqui vai a implementacao buscando de arquivo....
    var deferred = $q.defer();
    $http({
      method: 'GET',
      //TODO: Futuramente, alterar para buscar do backend...hoje estou trazendo um arquivo.
      url: 'mockdata/contas.json'
      //+  '?id=' + new Date().getTime()
    }).
      success(function (data) {
        deferred.resolve(data);
      }).
      error(function (data) {
        deferred.resolve(data);
      });

    return deferred.promise;
  };

  //Funcao de exemplo para poder mostrar "encadeamento de promessas".
  var excluiConta = function(idConta) {
//    var deferred = $q.defer();
//    deferred.resolve('funcao mock de exclusao.');
//    return deferred.promise;
  };

  var insereConta = function(conta) {
//    var deferred = $q.defer();
//    deferred.resolve('funcao mock de exclusao.');
//    return deferred.promise;
  };


  //return API
  return {
    getContas:getContas,
    excluiContas:excluiConta,
    insereConta:insereConta
  };


}]);