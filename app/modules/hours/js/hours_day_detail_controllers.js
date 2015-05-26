/**
 * Created by raul on 19/05/2015.
 */
'use strict';

//This is the controller for the 'hours module' of the appliation.
angular.module('zideco.hours.daydetailcontrollers', [
    'ui.bootstrap',
    'ui.router',
    'zideco.services',
    // 'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.filters',
    // 'zideco.directives',

    'angularGrid'
])

//TODO: remove to other file:
.controller('timeEntryDetailCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'hoursResourceService',
    'zidecoUtils',
    function($scope, $state, $stateParams, hoursResourceService, zidecoUtils) {
        $scope.entryID = $stateParams.entryid;
        if (!$scope.entryID || $scope.entryID === 0) {
        	$scope.entryID = undefined;
        	$scope.entry = {};
        } else {
        	hoursResourceService.getTimeEntry($scope.entryID).then(function(entry) {
        		$scope.entry = entry;
        	}, zidecoUtils.getStandardErrorTreater());
        }

        

        console.log('got here');
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
    'minutosFilter',
    function($scope, $state, $stateParams, hoursResourceService, zidecoUtils, minutosFilter) {
        $scope.dayBeingShown = moment($stateParams.day, 'DDMMYYYY');

        var columnDefs = [{
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

        }];


        var rowTypeInfoMap = {
            timeentry: {
                groupTitle: 'Time Entries',
                selectionFunction: function(row) {
                    $state.transitionTo('zideco.hours.daydetail.timeentrydetail', {
                        day: $stateParams.day,
                        entryid: row.id
                    });
                }
            },
            timeperiod: {
                groupTitle: 'Periods',
                selectionFunction: function(row) {
                    $state.transitionTo('zideco.hours.daydetail.timeperioddetail', {
                        day: $stateParams.day,
                        periodid: row.id
                    });
                }
            },
            ocurrence: {
                groupTitle: 'Ocurrences'
            }

        };

        function groupInnerRendererFunc(params) {
            var groupTitle;
            if (rowTypeInfoMap[params.node.key]) {
                groupTitle = rowTypeInfoMap[params.node.key].groupTitle;
            } else {
                groupTitle = '?';
            }

            // var flagCode = FLAG_CODES[params.node.key];

            // var html = '';
            // if (flagCode) {
            //     html += '<img class="flag" border="0" width="20" height="15" src="http://flags.fmcdn.net/data/flags/mini/'+flagCode+'.png">'
            // }

            // html += '<span class="groupTitle"> COUNTRY_NAME</span>'.replace('COUNTRY_NAME', params.node.key);
            // html += '<span class="medal gold"> Gold: GOLD_COUNT</span>'.replace('GOLD_COUNT', params.data.gold);
            // html += '<span class="medal silver"> Silver: SILVER_COUNT</span>'.replace('SILVER_COUNT', params.data.silver);
            // html += '<span class="medal bronze"> Bronze: BRONZE_COUNT</span>'.replace('BRONZE_COUNT', params.data.bronze);
            // var html = 'yo.';

            return groupTitle;
        }


        var rowSelectedFunc = function(row) {
            if (rowTypeInfoMap[row.type] && rowTypeInfoMap[row.type].selectionFunction) {
                rowTypeInfoMap[row.type].selectionFunction(row);
            } else {
                $state.transitionTo('zideco.hours.daydetail', {
                    day: $stateParams.day
                });

            }
        };


        $scope.gridOptions = {
            enableColResize: true,
            enableSorting: true,
            groupUseEntireRow: true,
            rowSelection: 'single',

            groupKeys: ['type'],
            groupInnerRenderer: groupInnerRendererFunc,
            rowSelected: rowSelectedFunc,



            columnDefs: columnDefs,
            rowData: null,
            dontUseScrolls: true // because so little data, no need to use scroll bars
        };
        $scope.displayFilters = {
            showTimeEntries: true,
            showTimePeriods: true,
            showOcurrences: true
        };

        //Rows that can be shown on grid.
        var timeEntryRows, timePeriodRows, ocurrencesRows;
        $scope.refreshGrid = function() {
            console.log('All phases complete... refresh the grid');

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

            $scope.gridOptions.rowData = rowdata;
            $scope.gridOptions.api.onNewRows();

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

            //Get all periods (for day)
            hoursResourceService.getTimeEntries(filter)
                .then(function(data) {
                    //Map data to grid data
                    // {"entryTime":"2015-05-04T11:05:00.000Z","origin":"transposed","status":"unprocessed","id":1,"user_id":2}
                    timeEntryRows = _.map(data, function(timeEntry) {
                        var ret = {};
                        ret.type = 'timeentry';
                        ret.id = timeEntry.id;
                        ret.columnTitle = 'Time Entry';
                        ret.value = moment(timeEntry.entryTime).format('HH:mm');
                        ret.status = timeEntry.origin + ' - ' + timeEntry.status;
                        ret.validMinutes = 'n.a.';
                        ret.rawMinutes = 'n.a.';
                        return ret;
                    });
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

                    timePeriodRows = _.map(data, function(timePeriod) {
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
                        ret.value = start.format(format) + ' - ' + end.format(format);
                        ret.validMinutes = minutosFilter(timePeriod.validMinutes.toString());
                        ret.rawMinutes = minutosFilter(timePeriod.rawMinutes.toString());
                        ret.status = timePeriod.origin + ' - ' + timePeriod.status;

                        return ret;

                    });
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
