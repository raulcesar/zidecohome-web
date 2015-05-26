/**
 * Created by raul on 23/05/14.
 */
'use strict';

angular.module('zideco.hours.reposervices', ['restangular'])
    .constant('version', '0.0.1')


.factory('hoursResourceService', ['$http', '$q', '$log', '$location', 'Restangular', function($http, $q, $log, $location, Restangular) {
    var timeEntryResource = 'timeentry',
        timePeriodResource = 'timeperiod',
        maxScrapedTimeentry = 'maxscrapedtimeentry';

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
    var getTimeEntry = function(id) {
        if (_.isUndefined(id)) {
            throw new Error('Please specify ID.');
        }

        return Restangular.one(timeEntryResource, id).get();
    };

    var getLastScrapedDate = function(filter) {
        return Restangular.one(maxScrapedTimeentry).get(filter);
        // var deferred = $q.defer();
        // Restangular.all(maxScrapedTimeentry).getList(filter).then(function(maxDateArray) {
        //     var maxDate;
        //     if (!_.isEmpty(maxDateArray)) {
        //         maxDate = maxDateArray[0];
        //     }
        //     deferred.resolve(maxDate);
        // }, function(err) {
        //     deferred.reject(err);
        // });

        // return deferred.promise;
    };


    var getTimeEntries = function(filter) {
        var restObject = Restangular.all(timeEntryResource);
        return restObject.getList(filter);
    };

    var saveTimeEntry = function(timeEntry) {
        if (_.isUndefined(timeEntry)) {
            throw new Error('Need object to save.');
        }

        if (Restangular.configuration.isRestangularized(timeEntry)) {
            return timeEntry.save();
        }

        return Restangular.all(timeEntryResource).post(timeEntry);
    };

    var getTimePeriods = function(filter) {

        var restObject = Restangular.all(timePeriodResource);
        return restObject.getList(filter);
    };

    var saveTimePeriods = function(timeEntry) {
        if (_.isUndefined(timeEntry)) {
            throw new Error('Need object to save.');
        }

        if (Restangular.configuration.isRestangularized(timeEntry)) {
            return timeEntry.save();
        }

        return Restangular.all(timePeriodResource).post(timeEntry);
    };


    //return API
    return {
        getTimeEntries: getTimeEntries,
        saveTimeEntry: saveTimeEntry,
        getTimePeriods: getTimePeriods,
        saveTimePeriods: saveTimePeriods,
        getTimeEntry: getTimeEntry,
        getLastScrapedDate: getLastScrapedDate

    };


}])

;
