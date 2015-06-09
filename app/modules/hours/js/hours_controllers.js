/**
 * Created by raul on 05/06/14.
 */
'use strict';

//This is the controller for the "hours module" of the appliation.
angular.module('zideco.hourscontrollers', [
    'ui.calendar',
    'ui.bootstrap',
    'ui.router',
    'zideco.services',
    'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.hours.services',
    'zideco.filters',
    'zideco.directives',
    'zideco.hours.daydetailcontrollers',
    'zideco.commonmodals',
    'formstamp'
])


.controller('hoursCtrlMain', [
    '$http',
    '$scope',
    '$compile',
    '$timeout',
    '$q',
    '$modal',
    '$state',
    'uiCalendarConfig',
    'commonResourceService',
    'hoursResourceService',
    'minutesFilter',
    'ServiceRequestFactory',
    'loadingservice',
    'Auth',
    'CommonDialogsService',
    'MessageIoSocket',
    'zidecoUtils',
    'monthSummaryHelpers',
    function($http, $scope, $compile, $timeout, $q, $modal, $state, uiCalendarConfig, commonResourceService, hoursResourceService, minutesFilter, ServiceRequestFactory, loadingservice, Auth, CommonDialogsService, MessageIoSocket, zidecoUtils, monthSummaryHelpers) {
        $scope.timePeriodEvents = [];
        $scope.timePeriodProjectedEvents = [];
        $scope.summaryEvents = [];

        $scope.eventSources = [{
            events: $scope.summaryEvents,
            color: '#009213',
            // textColor: 'black',
            overlap: false
        }, {
            events: $scope.timePeriodEvents
        }, {
            events: $scope.timePeriodProjectedEvents,
            color: '#FF2828'
        }];

        var serviceIdsSent = {};

        MessageIoSocket.init();
        // MessageIoSocket.registerDirectSocketListener(MessageIoSocket.events.news, function(data) {
        //     console.log('Recieved NEWS event. Data: ' + JSON.stringify(data));
        // });

        MessageIoSocket.registerDirectSocketListener(MessageIoSocket.events.zEvtServiceRequestDone, function(data) {
            if (serviceIdsSent[data.serviceRequestObj.id]) {
                serviceIdsSent[data.id] = undefined;

                $scope.refreshCalendar();
            }
            //If it is a 
        });



        $scope.eventClicked = function(calEvent, jsEvent, view) {
            $scope.openDayDetailPage(calEvent.start);

        };

        $scope.openDayDetailPage = function(obj) {

            //State version:
            $state.go('zideco.hours.daydetail', {
                day: obj.format('DDMMYYYY')
            });
        };

        // Full signature: (event, element, view) {
        $scope.eventRender = function(event, element) {
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
        $scope.endDate = undefined;


        var intervalNeedsRefresh = function(start, end) {
            if (_.isUndefined($scope.startDate) || _.isUndefined($scope.endDate)) {
                return true;
            }

            //if start is before start or after end
            if (start.isBefore($scope.startDate) || start.isAfter($scope.endDate)) {
                return true;
            }

            //if end is after end date (or before start... although this should never happen HERE, because if it is a valid period, 
            //the start would be before end, and hence also befor scope.start, and hence caught in if above!!,)
            if (end.isAfter($scope.endDate)) {
                return true;
            }

            return false;
        };

        $scope.changedDate = function(start, end) {
            //Only do something if new start and end are not within last interval
            if (!intervalNeedsRefresh(start, end)) {
                console.log('do not need refresh');
                return;
            }

            $scope.startDate = start;
            $scope.endDate = end;

            //clear month summary from start to finish
            var startMonth = moment(start.dayReference).month();
            var endMonth = moment(start.dayReference).month();
            for (var i = startMonth; i <= endMonth; i++) {
                var monthKey = moment(start.dayReference).format('MMYYYY');
                $scope.monthsummary[monthKey] = undefined;
            }
            $scope.setDefaultPeriods().then(function() {
                $scope.refreshCalendar();
            }, function(err) {
                console.log('Unable to set default periods. error: ' + err);
            });
        };


        $scope.monthsummary = {

        };

        $scope.setDefaultPeriods = function() {
            //For now, only one period to set
            var deferred = $q.defer();

            hoursResourceService.getLastScrapedDate().then(function(maxDate) {
                var cal = uiCalendarConfig.calendars.mainCal;
                var currentMoment = cal.fullCalendar('getDate');

                $scope.startDate4Scrape = moment(maxDate).format('DD/MM/YYYY');
                $scope.endDate4Scrape = moment(currentMoment).startOf('month').add(1, 'months').format('DD/MM/YYYY');
                deferred.resolve(maxDate);

            }, function(error) {
                loadingservice.hide('errorHandler: ' + JSON.stringify(error));
                deferred.reject(error);
            });

            return deferred.promise;

        };

        function calculateHoursForMonthUpTo(dateEnd) {
            var cal = uiCalendarConfig.calendars.mainCal;
            var dateStart = moment(cal.fullCalendar('getDate')).startOf('month');

            if (dateEnd) {
                dateEnd = moment(dateEnd);
            } else {
                dateEnd = moment(cal.fullCalendar('getDate')).startOf('month').add(1, 'months');
            }

            //
            dateEnd = dateEnd || currentMoment;

        }

        $scope.finishCalendarRefresh = function() {
            loadingservice.hide('refreshCalendar_success');
        };




        //Get month of calandar!
        $scope.refreshCalendar = function() {
            //Lets get the PeriodEntries for the current user to create events.
            loadingservice.show('refreshCalendar');
            //Controle all phases...
            var phases = ['timeperiods', 'holidays'];
            var phaseController = zidecoUtils.getPhaseController('monthSummaryPhaseController', phases, $scope.finishCalendarRefresh);


            monthSummaryHelpers.refreshTimePeriods($scope.startDate, $scope.endDate, $scope.timePeriodEvents, $scope.timePeriodProjectedEvents, $scope.summaryEvents, uiCalendarConfig, phaseController, phases[0]);
            monthSummaryHelpers.refreshHolidays($scope, uiCalendarConfig, phaseController, phases[1]);

        };

        //Scrape and process period
        // createScrapeAndProcessSequenceServiceRequest
        $scope.sendScrapeAndProcessServiceRequestForPeriod = function() {
            var startMoment = moment($scope.startDate4Scrape, 'DD/MM/YYYY');
            var endMoment = moment($scope.endDate4Scrape, 'DD/MM/YYYY');

            //Open modal for username and password.
            var modalInstance = CommonDialogsService.getUsernamePasswordModal();
            modalInstance.result
                .then(
                    function(userRetObj) {
                        //Send with undefined userid to process current user.
                        //userId, username, password, startDate, endDate
                        var userId;
                        var sequencedScrapeAndProcessService = ServiceRequestFactory.createScrapeAndProcessSequenceServiceRequest(userId, userRetObj.username, userRetObj.password, startMoment.toDate(), endMoment.toDate());
                        commonResourceService.saveServiceRequest(sequencedScrapeAndProcessService).then(function(obj) {
                            serviceIdsSent[obj.id] = true;
                            console.log('Scraping service started' + obj);
                        });
                    },
                    function(err) {
                        if (err) {
                            console.log('Error after username/password modal: ' + err);
                        }
                    });
        };


        //Process entries and create periods
        $scope.sendEntryProcessServiceRequestCurrentMonth = function() {
            var cal = uiCalendarConfig.calendars.mainCal;
            var currentMoment = cal.fullCalendar('getDate');
            var startMoment = moment(currentMoment).startOf('month');
            var endMoment = moment(startMoment).add(1, 'month');

            //Send with undefined userid to process current user.
            var serviceRequest = ServiceRequestFactory.createProcessTimeEntryServiceRequest(undefined, startMoment.toDate(), endMoment.toDate());
            commonResourceService.saveServiceRequest(serviceRequest).then(function() {
                console.log('Time Period processing service started ');
            });
        };

        //Scrape entries from source webpage
        $scope.sendScrapeTimeEntriesServiceRequestCurrentMonth = function() {
            var startMoment = moment($scope.startDate4Scrape, 'DD/MM/YYYY');
            var endMoment = moment($scope.endDate4Scrape, 'DD/MM/YYYY');

            //Open modal for username and password.
            var modalInstance = CommonDialogsService.getUsernamePasswordModal();
            modalInstance.result
                .then(
                    function(userRetObj) {
                        var scrapeService = ServiceRequestFactory.createTimeEntryScrapingServiceRequest(userRetObj.username, userRetObj.password, startMoment.toDate(), endMoment.toDate());
                        commonResourceService.saveServiceRequest(scrapeService).then(function() {
                            console.log('Scraping service started');
                        });
                    },
                    function(err) {
                        if (err) {
                            console.log('Error after username/password modal: ' + err);
                        }
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
                dayClick: $scope.openDayDetailPage,
                eventClick: $scope.eventClicked,
                eventRender: $scope.eventRender,
                viewRender: function(view, element) {
                        $scope.changedDate(view.start, view.end);
                    }
                    // dayClick: $scope.alertEventOnClick,
                    // eventDrop: $scope.alertOnDrop,
                    // eventResize: $scope.alertOnResize
            }
        };


        //Initialization.
        // $scope.refreshCalendar(); - commented out because fullCal already calls this.


    }
]);
