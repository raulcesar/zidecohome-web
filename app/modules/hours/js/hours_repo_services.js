/**
 * Created by raul on 23/05/14.
 */
'use strict';

angular.module('zideco.hours.reposervices', [])
    .constant('version', '0.0.1')


.factory('hoursResourceService', ['$http', '$q', '$log', '$location', 'Restangular', function($http, $q, $log, $location, Restangular) {
    var resourceTimeEntry = 'timeentry';

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

    var getTimeEntries = function(filter) {
        var restObject = Restangular.all(resourceTimeEntry);
        return restObject.getList(filter);
    };

    var saveTimeEntry = function(timeEntry) {
        if (_.isUndefined(timeEntry)) {
            throw new Error('Need object to save.');
        }

        if (Restangular.configuration.isRestangularized(timeEntry)) {
            return timeEntry.save();
        }

        return Restangular.all(resourceTimeEntry).post(timeEntry);
    };

    //return API
    return {
        getTimeEntries: getTimeEntries,
        saveTimeEntry: saveTimeEntry
    };


}])

;
