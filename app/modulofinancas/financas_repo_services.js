
/**
 * Created by raul on 23/05/14.
 */
'use strict';

var zidecoFinancasServices = angular.module('zideco.financas.reposervices', [])
  .constant('version', '0.0.1');

zidecoFinancasServices.factory('contaResourceService', ['$http', '$q', '$log', '$location', 'Restangular', function ($http, $q, $log, $location, Restangular) {

  var resource = 'contas';

  var getContas = function (termoPesquisa) {
    var contaRest = Restangular.all(resource);
    if (termoPesquisa) {
      return contaRest.getList({'termoPesquisa': termoPesquisa});
    } else {
      return contaRest.getList();
    }
  };

  var excluiConta = function(idPessoa) {
    return Restangular.one(resource, idPessoa).remove();
  };

  var incluiConta = function(conta) {

  };

  //return API

  return {
    getContas:getContas,
    excluiContas:excluiConta,
    insereConta:insereConta
  };


}]);