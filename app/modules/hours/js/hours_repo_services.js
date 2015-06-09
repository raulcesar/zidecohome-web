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

        //Dates are a pain in the ass! Because of this, we will convert them to 
        //a YYYMMDDHH:mm format to serialize.
        var dateMoment = moment(timeEntry.entryTime);
        timeEntry.entryTime = dateMoment.format('YYYYMMDDHH:mm');

        if (Restangular.configuration.isRestangularized(timeEntry)) {
            return timeEntry.save();
        }

        return Restangular.all(timeEntryResource).post(timeEntry);
    };


        // var excluiPessoa = function(idPessoa) {
        //     if (_.isUndefined(idPessoa)) {
        //         return resolveErroComPromessa('idPessoa obrigatorio ao executar excluiPessoa');
        //     }
        //     return Restangular.one(resourcePessoaCompleta, idPessoa).remove();
        // };

    var deleteTimeEntry = function(idTimeEntry) {
        if (_.isUndefined(idTimeEntry)) {
            throw new Error('Need ID to delete.');
        }
        return Restangular.one(timeEntryResource, idTimeEntry).remove();
    };

    var deleteTimePeriod = function(idTimePeriod) {
        if (_.isUndefined(idTimePeriod)) {
            throw new Error('Need ID to delete.');
        }
        return Restangular.one(timePeriodResource, idTimePeriod).remove();
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
        getLastScrapedDate: getLastScrapedDate,
        deleteTimeEntry:deleteTimeEntry,
        deleteTimePeriod: deleteTimePeriod

    };


}])

;
