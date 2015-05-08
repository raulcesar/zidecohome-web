/**
 * Created by raul on 08/05/2015.
 */
'use strict';

angular.module('zideco.common.reposervices', [])
    .constant('version', '0.0.1')


.factory('commonResourceService', ['$http', '$q', '$log', '$location', 'Restangular', function($http, $q, $log, $location, Restangular) {
    var serviceRequestResource = 'servicerequest'
    ;

    // function resolveErroComPromessa(msg) {
    //    var deferred = $q.defer();

    //    deferred.reject({
    //       status: 'error',
    //       msg: msg,
    //       //para manter compatibilidade com o restangular
    //       data: {
    //          err: msg
    //       }
    //    });
    //    return deferred.promise;
    // }

    var getServiceRequests = function(filter) {
        var restObject = Restangular.all(serviceRequestResource);
        return restObject.getList(filter);
    };

    var saveServiceRequest = function(serviceRequest) {
        if (_.isUndefined(serviceRequest)) {
            throw new Error('Need object to save.');
        }

        if (Restangular.configuration.isRestangularized(serviceRequest)) {
            return serviceRequest.save();
        }

        return Restangular.all(serviceRequestResource).post(serviceRequest);
    };


    //return API
    return {
        getServiceRequests: getServiceRequests,
        saveServiceRequest: saveServiceRequest
    };


}])

;
