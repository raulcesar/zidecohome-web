/**
 * Created by raul on 05/06/14.
 */
'use strict';

//This is the controller for the "hours module" of the appliation.
angular.module('zideco.hourscontrollers', [
    'ui.calendar',
    'zideco.services',
    'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.filters'
])


.controller('hoursCtrlMain', [
    '$scope',
    '$compile',
    'uiCalendarConfig',
    'commonResourceService',
    'hoursResourceService',
    'minutosFilter',
    'ServiceRequestFactory',
    function($scope, $compile, uiCalendarConfig, commonResourceService, hoursResourceService, minutosFilter, ServiceRequestFactory) {
        console.log('Got to hours main controller');


        // var date = new Date();
        // var d = date.getDate();
        // var m = date.getMonth();
        // var y = date.getFullYear();
        $scope.events = [];
        $scope.eventsTeste = [
            // {
            //     title: 'All Day Event',
            //     start: new Date(y, m, 1)
            // }, {
            //     title: 'Long Event',
            //     start: new Date(y, m, d - 5),
            //     end: new Date(y, m, d - 2)
            // }, {
            //     id: 999,
            //     title: 'Repeating Event',
            //     start: new Date(y, m, d - 3, 16, 0),
            //     allDay: false
            // }, {
            //     id: 999,
            //     title: 'Repeating Event',
            //     start: new Date(y, m, d + 4, 16, 0),
            //     allDay: false
            // }, {
            //     title: 'Birthday Party',
            //     start: new Date(y, m, d + 1, 19, 0),
            //     end: new Date(y, m, d + 1, 22, 30),
            //     allDay: false
            // }, {
            //     title: 'Click for Google',
            //     start: new Date(y, m, 28),
            //     end: new Date(y, m, 29),
            //     url: 'http://google.com/'
            // }
        ];

        $scope.summaryEvents = [];
        $scope.eventSources = [{
                events: $scope.summaryEvents,
                color: '#009213',
                // textColor: 'black',
                overlap: false
            }, {
                events: $scope.events
            }

        ];


        $scope.alertEventOnClick = function(obj) {
            alert('clicked on day');
            alert('obj: ' + obj);
        };

        $scope.eventRender = function(event, element, view) {
            if (event.notip === true) {
                return;
            }
            var tip = event.tooltip || event.title;
            element.attr({
                'tooltip': tip,
                'tooltip-append-to-body': true
            });
            $compile(element)($scope);
        };

        $scope.startDate = undefined;
        $scope.endDate= undefined;
        
        $scope.changedDate = function(start, end) {
            $scope.startDate = start;
            $scope.endDate = end;

            //clear month summary from start to finish
            var startMonth = moment(start.dayReference).month();
            var endMonth = moment(start.dayReference).month();
            for(var i = startMonth; i <= endMonth; i ++) {
                var monthKey = moment(start.dayReference).format('MMYYYY');
                $scope.monthsummary[monthKey] = undefined;
            }



            $scope.refreshCalendar();

        };

        $scope.monthsummary = {

        };

        //Get month of calandar!

        $scope.refreshCalendar = function() {
            //Lets get the PeriodEntries for the current user to create events.
    
            var filter = {
                start: $scope.startDate.toDate(),
                end: $scope.endDate.toDate()
            };


            hoursResourceService.getTimePeriods(filter).then(function(data) {
                //Each object has a "validMinutes" that tells us how many minutes
                console.log('periods');
                //TODO: VER COMO VAI SER:
                $scope.events.length = 0;

                var sortFunc = function(date) {
                    return moment(date).unix();
                };

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
                        title: minutosFilter(period.validMinutes.toString()),
                        start: moment(period.dayReference).add(i, 'seconds').toDate(),
                        tooltip: moment(period.startTime).format('DD/MM HH:mm') + ' a ' +
                            moment(period.endTime).format('DD/MM HH:mm')
                            // end: period.dayReference
                    };
                    $scope.events.push(event);
                }

                //Now generate summary event...
                $scope.summaryEvents.length = 0;


                _.forOwn(summaries, function(value, key) {
                    var summaryEvent = {
                        title: minutosFilter(value.totalValidMinutes.toString()),
                        start: value.dayReference,
                        notip: true,
                        allDay: true
                            // end: period.dayReference
                    };
                    $scope.summaryEvents.push(summaryEvent);

                    //Add to month summary
                    var monthKey = moment(value.dayReference).format('MMYYYY');
                    var montSummary = $scope.monthsummary[monthKey] || {
                        totalValidMinutes: 0
                    };

                    montSummary.totalValidMinutes += value.totalValidMinutes;
                    $scope.monthsummary[monthKey] = montSummary;
                });

                var cal = uiCalendarConfig.calendars.mainCal;
                var currentMoment = cal.fullCalendar('getDate');
                var monthKey = moment(currentMoment).format('MMYYYY');
                $scope.monthSummary = $scope.monthsummary[monthKey];



                console.log('events should have: ' + $scope.events.length);


            });


        };


        $scope.sendEntryProcessServiceRequestCurrentMonth = function() {
            var cal = uiCalendarConfig.calendars.mainCal;
            var currentMoment = cal.fullCalendar('getDate');
            var startMoment = moment(currentMoment).startOf('month');
            var endMoment = moment(startMoment).add(1, 'month');
            var userId = 2; //TODO: Get from current user



            var serviceRequest = ServiceRequestFactory.createProcessTimeEntryServiceRequest(userId, startMoment.toDate(), endMoment.toDate());
            commonResourceService.saveServiceRequest(serviceRequest).then(function(data) {
                console.log('sent servicerequest');
            });

        };


        $scope.uiConfig = {
            calendar: {
                height: 600,
                editable: true,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                dayClick: $scope.alertEventOnClick,
                eventRender: $scope.eventRender,
                viewRender: function(view, element) {
                    $scope.changedDate(view.start, view.end);
                        console.log('View Changed: ' + ' - ' + view.start.format('DD/MM/YYYY') + ' - ' + view.end.format('DD/MM/YYYY'));
                    }
                    // dayClick: $scope.alertEventOnClick,
                    // eventDrop: $scope.alertOnDrop,
                    // eventResize: $scope.alertOnResize
            }
        };


        // $scope.refreshCalendar();

    }
]);
