/**
 * Created by raul on 03/06/14.
 */
'use strict';

angular.module('zideco.hours.services', [
    'zideco.services',
    'zideco.hours.reposervices',
    'zideco.filters'
])

.factory('hoursServices', [function() {
    var events = {
        evtTimeEntryChanged: 'evtTimeEntryChanged',
        evtTimePeriodChanged: 'evtTimePeriodChanged'
    };

    var getDefaultGridOptions = function(overrides) {
        var ret = {
            enableColResize: true,
            enableSorting: true,
            groupUseEntireRow: true,
            rowSelection: 'single',
            // groupKeys: ['type'],
            // groupInnerRenderer: groupInnerRendererFunc,
            // rowSelected: rowSelectedFunc,
            // columnDefs: columnDefs,
            rowData: null,
            dontUseScrolls: true // because so little data, no need to use scroll bars
        };

        _.assign(ret, overrides);

        return ret;
    };

    return {
        events: events,
        getDefaultGridOptions: getDefaultGridOptions
    };

}])


.factory('monthSummaryHelpers', [
    'hoursResourceService',
    'minutesFilter',
    'zidecoUtils',
    function(hoursResourceService, minutesFilter, zidecoUtils) {
        var refreshMonthSummary = function(timePeriodEvents, summaryEvents, uiCalendarConfig, phaseController, phaseToFinish) {
            //Month summary will have 3 "times":
            //1) Total time so far (including "projected event")
//2) 


            //             //Add to month summary
            // var monthKey = moment(value.dayReference).format('MMYYYY');
            // var montSummary = scope.monthsummary[monthKey] || {
            //     totalValidMinutes: 0
            // };

            // montSummary.totalValidMinutes += value.totalValidMinutes;
            // scope.monthsummary[monthKey] = montSummary;
            // var cal = uiCalendarConfig.calendars.mainCal;
            // var currentMoment = cal.fullCalendar('getDate');
            // var monthKey = moment(currentMoment).format('MMYYYY');
            // scope.monthSummary = scope.monthsummary[monthKey];

        };

        var refreshDaySummary = function(timePeriodEvents, summaryEvents, uiCalendarConfig, phaseController, phaseToFinish) {};


        var refreshTimePeriods = function(startMoment, endMoment, timePeriodEvents, timePeriodSummaryEvents, uiCalendarConfig, phaseController, phaseToFinish) {
            var filter = {
                start: startMoment.toDate(),
                end: endMoment.toDate()
            };

            hoursResourceService.getTimePeriods(filter).then(function(data) {
                //Each object has a "validMinutes" that tells us how many minutes
                timePeriodEvents.length = 0;

                // var sortFunc = function(date) {
                //     return moment(date).unix();
                // };

                data = _.sortByAll(data, ['dayReference', 'startTime']);
                var summaries = {};

                for (var i = 0; i < data.length; i++) {
                    var period = data[i];
                    //Make event for "day summary"
                    var key = moment(period.dayReference).format('DDMMYYYY');
                    var summary = summaries[key];
                    if (!summary) {
                        summary = {
                            dayReference: period.dayReference,
                            totalNeededMinutes: 8 * 60,
                            totalValidMinutes: 0
                        };
                        summaries[key] = summary;
                    }
                    summary.totalValidMinutes += period.validMinutes;
                    summary.neededMinutes = summary.totalNeededMinutes - summary.totalValidMinutes;




                    var event = {
                        title: minutesFilter(period.validMinutes.toString()),
                        start: moment(period.dayReference).add(i, 'seconds').toDate(),
                        tooltip: moment(period.startTime).format('DD/MM HH:mm') + ' a ' +
                            moment(period.endTime).format('DD/MM HH:mm')
                            // end: period.dayReference
                    };
                    timePeriodEvents.push(event);
                }



                //Now generate summary event...
                timePeriodSummaryEvents.length = 0;


                _.forOwn(summaries, function(value, key) {
                    var summaryEvent = {
                        title: minutesFilter(value.totalValidMinutes.toString()),
                        start: value.dayReference,
                        notip: true,
                        allDay: true
                            // end: period.dayReference
                    };
                    timePeriodSummaryEvents.push(summaryEvent);

                    // //Add to month summary
                    // var monthKey = moment(value.dayReference).format('MMYYYY');
                    // var montSummary = scope.monthsummary[monthKey] || {
                    //     totalValidMinutes: 0
                    // };

                    // montSummary.totalValidMinutes += value.totalValidMinutes;
                    // scope.monthsummary[monthKey] = montSummary;
                });

                // var cal = uiCalendarConfig.calendars.mainCal;
                // var currentMoment = cal.fullCalendar('getDate');
                // var monthKey = moment(currentMoment).format('MMYYYY');
                // scope.monthSummary = scope.monthsummary[monthKey];

                // console.log('events should have: ' + timePeriodEvents.length);
                // loadingservice.hide('refreshCalendar_success');
                phaseController.finishPhase(phaseToFinish); //time Periods

            }, zidecoUtils.getStandardErrorTreater({
                phaseController: phaseController,
                phaseName: phaseToFinish
            }));
        };

        var refreshHolidays = function(scope, uiCalendarConfig, phaseController, phaseToFinish) {
            phaseController.finishPhase(phaseToFinish); //Holidays
        };

        return {
            refreshTimePeriods: refreshTimePeriods,
            refreshHolidays: refreshHolidays
        };

    }
])

;
