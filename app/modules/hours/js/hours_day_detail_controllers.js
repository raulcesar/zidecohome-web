/**
 * Created by raul on 19/05/2015.
 */
'use strict';

//This is the controller for the 'hours module' of the appliation.
angular.module('zideco.hours.daydetailcontrollers', [
    'ui.bootstrap',
    'ui.router',
    'zideco.directives.actionbar',
    'zideco.services',
    'zideco.commonmodals',
    'zideco.hours.services',
    // 'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.filters',
    // 'zideco.directives',
    'ui.mask',

    'angularGrid'
])

//TODO: remove to other file:
.controller('timeEntryDetailCtrl', [
    '$rootScope',
    '$scope',
    '$state',
    '$stateParams',
    'hoursResourceService',
    'zidecoUtils',
    'CommonDialogsService',
    'hoursServices',
    function($rootScope, $scope, $state, $stateParams, hoursResourceService, zidecoUtils, CommonDialogsService, hoursServices) {
        $scope.entryID = $stateParams.entryid;
        if (!$scope.entryID || $scope.entryID === 0) {
            $scope.entryID = undefined;
            $scope.entry = {
                origin: 'manual'
            };
        } else {
            hoursResourceService.getTimeEntry($scope.entryID).then(function(entry) {
                $scope.entry = entry;
                $scope.entryTime = moment(entry.entryTime).format('HH:mm');
            }, zidecoUtils.getStandardErrorTreater());
        }

        $scope.saveEntry = function() {
            var datePart = moment($scope.entry.entryTime).format('DDMMYYYY');
            $scope.entry.entryTime = moment(datePart + $scope.entryTime, 'DDMMYYYYHH:mm').toDate();
            $scope.entry.origin = 'manual';
            hoursResourceService.saveTimeEntry($scope.entry).then(function(data) {
                $rootScope.$broadcast(hoursServices.events.evtTimeEntryChanged);
            });
        };

        $scope.deleteEntry = function() {
            var modalInstance = CommonDialogsService.getModalConfirmation('Are you sure you wish to delete this entry?');

            modalInstance.result
                .then(
                    function(retorno) {
                        if (retorno) {
                            //Confirmado. Vamos excluir.
                            hoursResourceService.deleteTimeEntry($scope.entryID)
                                .then(function() {
                                    $scope.refreshDayList();
                                }, function(err) {
                                    console.log('Error while trying to delete entry: ' + $scope.entryID + ': ' + err);
                                });
                        }
                    },
                    function(err) {
                        console.log('Canceled modal. Ret par: ' + err);
                    });
        };
    }
])

//TODO: remove to other file:
.controller('timePeriodDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    function($scope, $state, $stateParams) {
        $scope.periodID = $stateParams.periodid;
        console.log('got here');

    }
])

// .controller('hoursDayDetailCtrl', ['$scope', 'dayMoment',  function($scope, dayMoment) {
.controller('hoursDayDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'hoursResourceService',
    'zidecoUtils',
    'CommonDialogsService',
    'minutesFilter',
    'hoursServices',
    function($scope, $state, $stateParams, hoursResourceService, zidecoUtils, CommonDialogsService, minutesFilter, hoursServices) {
        $scope.dayBeingShown = moment($stateParams.day, 'DDMMYYYY');
        if (!$scope.dayBeingShown.isValid()) {
            $state.go('zideco.hours.currentmonth');
        }


        $scope.$on(hoursServices.events.evtTimeEntryChanged, function(ev, data) {
            //TODO: If the current day matches with the entry day, than refresh.
            // if ()
            $scope.refreshDayList();
        });
        $scope.$on(hoursServices.events.evtTimePeriodChanged, function(ev, data) {
            //TODO: If the current day matches with the entry day, than refresh.
            // if ()
            $scope.refreshDayList();
        });







        $scope.insertManualTimeEntry = function() {
            if (!$scope.newentrytime || $scope.newentrytime.trim() === '') {
                return;
            }
            //call repo service sending in this bad boy.
            console.log(moment($scope.dayBeingShown.format('DDMMYYYY') + $scope.newentrytime, 'DDMMYYYYHH:mm').format('HHmm'));

            var timeentry = {
                entryTime: moment($scope.dayBeingShown.format('DDMMYYYY') + $scope.newentrytime, 'DDMMYYYYHH:mm').toDate(),
                origin: 'manual'
            };
            hoursResourceService.saveTimeEntry(timeentry).then(function(data) {
                console.log('saved. data: ' + JSON.stringify(data));
                $scope.refreshDayList();
            });
        };

        function isTimeValid(timeString, argFormat) {
            if (!timeString) {
                return false;
            }

            argFormat = argFormat || 'HHmm';

            var datePart = $scope.dayBeingShown.format('DDMMYYYY');
            var newTime = moment(datePart + timeString, 'DDMMYYYY' + argFormat);
            if (!newTime.isValid() || !moment.isMoment(newTime)) {
                return false;
            }

            var feedbackCheck = newTime.format(argFormat);
            console.log('Got to feedbackCheck. feedbackCheck: ' + feedbackCheck + ' timeString: ' + timeString);
            return (feedbackCheck === timeString);
        }


        $scope.timeEntryDirty = function() {
            var timeValid = isTimeValid($scope.curentTimeEntryInput.unformatedValue);
            $scope.timeEntryBarOptions.allowSave = timeValid;
        };
        $scope.timePeriodDirty = function() {
            $scope.timePeriodBarOptions.allowSave = true;
        };

        $scope.timeEntryBarOptions = {
            hideEdit: true,
            hideSave: false
        };

        $scope.timePeriodBarOptions = {
            hideEdit: true,
            hideSave: false
        };

        // $scope.curentTimeEntryInput = {};
        // $scope.curentTimePeriodInput = {};
        $scope.focusOnTimeEntryInput = false;
        $scope.newTimeEntry = function() {
            $scope.curentTimeEntryInput = {};
            $scope.frmTimeEntryInput.$setPristine();
            $scope.frmTimeEntryInput.$setUntouched();
            $scope.timeEntryBarOptions.allowSave = false;
            $scope.timeEntryBarOptions.allowDelete = false;
            $scope.focusOnTimeEntryInput = true ;
        };
        
        $scope.saveTimeEntry = function() {
            var datePart = $scope.dayBeingShown.format('DDMMYYYY');
            var newTime = moment(datePart + $scope.curentTimeEntryInput.unformatedValue, 'DDMMYYYYHHmm');
           
            var timeEntry = {
                id: $scope.curentTimeEntryInput.id,
                entryTime: newTime.toDate(),
                origin: 'manual',
                status: 'unprocessed'
            };

            hoursResourceService.saveTimeEntry(timeEntry).then(function(data) {
                console.log('Saved timeEntry: ' +data);
                $scope.refreshDayList();
            });
        };
        $scope.deleteTimeEntry = function() {
            if (!$scope.curentTimeEntryInput.id) {
                return;
            }
            var modalInstance = CommonDialogsService.getModalConfirmation('Are you sure you wish to delete this entry?');

            modalInstance.result
                .then(
                    function(retorno) {
                        if (retorno) {
                            //Confirmado. Vamos excluir.
                            hoursResourceService.deleteTimeEntry($scope.curentTimeEntryInput.id)
                                .then(function() {
                                    $scope.refreshDayList();
                                }, function(err) {
                                    console.log('Error while trying to delete entry: ' + $scope.entryID + ': ' + err);
                                });
                        }
                    },
                    function(err) {
                        console.log('Canceled modal. Ret par: ' + err);
                    });
        };


        $scope.timeEntryGridOptions = hoursServices.getDefaultGridOptions({
            // groupInnerRenderer: groupInnerRendererFunc,
            rowSelected: function(row) {
                $scope.curentTimeEntryInput = row;
                $scope.frmTimeEntryInput.$setPristine();
                $scope.frmTimeEntryInput.$setUntouched();
                $scope.timeEntryBarOptions.allowSave = false;
                $scope.timeEntryBarOptions.allowDelete = true;
            },
            columnDefs: [{
                displayName: 'Value',
                field: 'value'
            }, {
                displayName: 'Status',
                field: 'status'
            }]
        });

        $scope.timePeriodGridOptions = hoursServices.getDefaultGridOptions({
            // groupInnerRenderer: groupInnerRendererFunc,
            rowSelected: function(row) {
                $scope.curentTimePeriodInput = row;
                $scope.frmTimePeriodInput.$setPristine();
                $scope.frmTimePeriodInput.$setUntouched();
                $scope.timePeriodBarOptions.allowSave = false;
            },
            columnDefs: [{
                displayName: 'Value',
                field: 'value'
            }, {
                displayName: 'Status',
                field: 'status'
            }, {
                displayName: 'Valid Minutes',
                field: 'validMinutes'

            }, {
                displayName: 'Raw Minutes',
                field: 'rawMinutes'

            }]
        });

        $scope.displayFilters = {
            showTimeEntries: true,
            showTimePeriods: true,
            showOcurrences: true
        };

        //Rows that can be shown on grid.
        var timeEntryRows, timePeriodRows, ocurrencesRows;
        $scope.refreshGrid = function() {

            //Depending on filter, we concat the new array.
            var rowdata = [];
            if ($scope.displayFilters.showTimeEntries) {
                rowdata = rowdata.concat(timeEntryRows);
            }
            if ($scope.displayFilters.showTimePeriods) {
                rowdata = rowdata.concat(timePeriodRows);
            }
            if ($scope.displayFilters.showOcurrences) {
                rowdata = rowdata.concat(ocurrencesRows);
            }

            $scope.timeEntryGridOptions.rowData = timeEntryRows;
            $scope.timeEntryGridOptions.api.onNewRows();

            $scope.timePeriodGridOptions.rowData = timePeriodRows;
            $scope.timePeriodGridOptions.api.onNewRows();

            // $scope.gridOptions.rowData = rowdata;
            // $scope.gridOptions.api.onNewRows();

        };


        //Controle all phases...
        var phases = ['timeentries', 'timeperiods', 'ocurrences'];
        var phaseController = zidecoUtils.getPhaseController('dayDetailsPhaseController', phases, $scope.refreshGrid);

        $scope.refreshDayList = function() {
            //Setup filter based on current day.
            var filter = {
                start: $scope.dayBeingShown.toDate(),
                end: moment($scope.dayBeingShown).add(1, 'day').toDate()
            };

            //Get all Time Entries (for day)
            hoursResourceService.getTimeEntries(filter)
                .then(function(data) {
                    //Map data to grid data
                    // {"entryTime":"2015-05-04T11:05:00.000Z","origin":"transposed","status":"unprocessed","id":1,"user_id":2}
                    timeEntryRows = _.sortBy(
                        _.map(data, function(timeEntry) {
                            var ret = {};
                            ret.type = 'timeentry';
                            ret.id = timeEntry.id;
                            ret.columnTitle = 'Time Entry';
                            ret.value = moment(timeEntry.entryTime).format('HH:mm');
                            ret.unformatedValue = moment(timeEntry.entryTime).format('HHmm');
                            ret.status = timeEntry.origin + ' - ' + timeEntry.status;
                            ret.validMinutes = 'n.a.';
                            ret.rawMinutes = 'n.a.';
                            return ret;
                        }), 'value');
                    // $scope.gridOptions.rowData = $scope.rowData;




                    phaseController.finishPhase(phases[0]); //timeentries
                }, zidecoUtils.getStandardErrorTreater({
                    phaseController: phaseController,
                    phaseName: phases[0]
                }));

            // Get all timePeriods (for day)
            hoursResourceService.getTimePeriods(filter)
                .then(function(data) {
                    //Map data to grid data
                    // {"startTime":"2015-05-04T11:05:00.000Z","endTime":"2015-05-04T15:00:00.000Z","dayReference":"2015-05-04T03:00:00.000Z","rawMinutes":235,"validMinutes":235,"origin":"generated","status":"new","id":1,"user_id":2,"startentry_id":null,"endentry_id":null}

                    timePeriodRows = _.sortBy(
                        _.map(data, function(timePeriod) {
                            // var value;
                            // var dayRef = moment(timePeriod.dayReference);
                            var start = moment(timePeriod.startTime);
                            var end = moment(timePeriod.endTime);
                            var format = 'HH:mm';
                            if (start.date() !== end.date()) {
                                format = 'DD/MM/YYYY HH:mm';
                            }

                            var ret = {};
                            ret.type = 'timeperiod';
                            ret.id = timePeriod.id;
                            ret.columnTitle = 'Time Period';
                            ret.startMoment = start;
                            ret.startValue = start.format(format);
                            ret.endValue = end.format(format);

                            ret.value = start.format(format) + ' - ' + end.format(format);
                            ret.validMinutes = minutesFilter(timePeriod.validMinutes.toString());
                            ret.rawMinutes = minutesFilter(timePeriod.rawMinutes.toString());
                            ret.status = timePeriod.origin + ' - ' + timePeriod.status;

                            return ret;

                        }), 'startMoment');
                    // $scope.gridOptions.rowData = $scope.rowData;




                    phaseController.finishPhase(phases[1]); //timeentries
                }, zidecoUtils.getStandardErrorTreater({
                    phaseController: phaseController,
                    phaseName: phases[1]
                }));

            // timePeriodRows = [];
            // phaseController.finishPhase(phases[1]); //timeperiods

            //Get all ocurrences (for day) ***NO api yet
            ocurrencesRows = [];
            phaseController.finishPhase(phases[2]); //ocurrences

        };

        //This controller should permit the saving of new periods, events or entries for the day.
        //On close, we should 

        $scope.refreshDayList();
    }
]);


// function groupInnerRendererFunc(params) {
//     var groupTitle;
//     if (rowTypeInfoMap[params.node.key]) {
//         groupTitle = rowTypeInfoMap[params.node.key].groupTitle;
//     } else {
//         groupTitle = '?';
//     }

//     // var flagCode = FLAG_CODES[params.node.key];

//     // var html = '';
//     // if (flagCode) {
//     //     html += '<img class="flag" border="0" width="20" height="15" src="http://flags.fmcdn.net/data/flags/mini/'+flagCode+'.png">'
//     // }

//     // html += '<span class="groupTitle"> COUNTRY_NAME</span>'.replace('COUNTRY_NAME', params.node.key);
//     // html += '<span class="medal gold"> Gold: GOLD_COUNT</span>'.replace('GOLD_COUNT', params.data.gold);
//     // html += '<span class="medal silver"> Silver: SILVER_COUNT</span>'.replace('SILVER_COUNT', params.data.silver);
//     // html += '<span class="medal bronze"> Bronze: BRONZE_COUNT</span>'.replace('BRONZE_COUNT', params.data.bronze);
//     // var html = 'yo.';

//     return groupTitle;
// }


// var rowTypeInfoMap = {
//     timeentry: {
//         groupTitle: 'Time Entries',
//         selectionFunction: function(row) {
//             $state.transitionTo('zideco.hours.daydetail.timeentrydetail', {
//                 day: $stateParams.day,
//                 entryid: row.id
//             });
//         }
//     },
//     timeperiod: {
//         groupTitle: 'Periods',
//         selectionFunction: function(row) {
//             $state.transitionTo('zideco.hours.daydetail.timeperioddetail', {
//                 day: $stateParams.day,
//                 periodid: row.id
//             });
//         }
//     },
//     ocurrence: {
//         groupTitle: 'Ocurrences'
//     }
// };

// var rowSelectedFunc = function(row) {
//     if (rowTypeInfoMap[row.type] && rowTypeInfoMap[row.type].selectionFunction) {
//         rowTypeInfoMap[row.type].selectionFunction(row);
//     } else {
//         $state.transitionTo('zideco.hours.daydetail', {
//             day: $stateParams.day
//         });

//     }
// };
