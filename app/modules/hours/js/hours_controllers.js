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
    'zideco.filters',
    'zideco.directives',
    'zideco.hours.daydetailcontrollers',
    'zideco.commonmodasl'
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
    'minutosFilter',
    'ServiceRequestFactory',
    'loadingservice',
    'Auth',
    'UsernamePasswordModalService',
    'MessageIoSocket',
    function($http, $scope, $compile, $timeout, $q, $modal, $state, uiCalendarConfig, commonResourceService, hoursResourceService, minutosFilter, ServiceRequestFactory, loadingservice, Auth, UsernamePasswordModalService, MessageIoSocket) {
        console.log('starting up hours controller... Should only happen once!');
        $scope.events = [];
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

        MessageIoSocket.init();
        MessageIoSocket.registerDirectSocketListener(MessageIoSocket.events.news, function(data) {
            console.log('Recieved NEWS event. Data: ' + JSON.stringify(data));
        });

        MessageIoSocket.registerDirectSocketListener(MessageIoSocket.events.zEvtServiceRequestDone, function(data) {
            console.log('Recieved ServiceDone event. Data: ' + JSON.stringify(data));
        });



        // = function(scope, zEvt, cb) {

        // $scope.$on('socket:' + MessageIoSocket.zEvtServiceRequestDone, function(ev, data) {
        //     console.log('pessoa alterada: ' + data);
        //     if (parseInt(data.id) === parseInt($scope.pessoaAtivaCompleta.id)) {
        //         setaSePessoaNova($scope.pessoaAtivaCompleta);
        //     }
        // });

        $scope.testio = function() {
            $http({
                method: 'GET',
                url: 'http://localhost:3030/message'
            }).
            success(function() {
                console.log('Just called URL for message. Soon, we should recieve news event!!');
            }).
            error(function(err) {
                console.log('Error trying to call message URL: ' + err);
            });

        };

        $scope.eventClicked = function(calEvent, jsEvent, view) {
            $scope.openDayDetailPage(calEvent.start);

        };

        $scope.openDayDetailPage = function(obj) {

            //State version:
            $state.go('zideco.hours.daydetail', {
                day: obj.format('DDMMYYYY')
            });




            //Modal version...
            // var modalInstance = $modal.open({
            //     animation: false,
            //     templateUrl: 'modules/hours/views/hours_day_detail.html',
            //     controller: 'hoursDayDetailCtrl',
            //     size: 'lg',
            //     resolve: {
            //         dayMoment: function() {
            //             return obj;
            //         }
            //     }
            // });

            // modalInstance.result.then(function (selectedItem) {
            //       $scope.selected = selectedItem;
            //     }, function () {
            //       $log.info('Modal dismissed at: ' + new Date());
            //     });            
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
            console.log('going to refresh. start: ' + start.format('DD/MM/YYYY') + ' end: ' + end.format('DD/MM/YYYY'));

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

        var errorHandler = function(error) {
            loadingservice.hide('errorHandler: ' + JSON.stringify(error));
            console.log('Error: ' + JSON.stringify(error));
        };

        $scope.setDefaultPeriods = function() {
            //For now, only one period to set
            var deferred = $q.defer();

            loadingservice.show('setDefaultPeriods');
            hoursResourceService.getLastScrapedDate().then(function(maxDate) {
                var cal = uiCalendarConfig.calendars.mainCal;
                var currentMoment = cal.fullCalendar('getDate');

                $scope.startDate4Scrape = moment(maxDate).format('DD/MM/YYYY');
                $scope.endDate4Scrape = moment(currentMoment).startOf('month').add(1, 'months').format('DD/MM/YYYY');
                loadingservice.hide('setDefaultPeriods_success');
                deferred.resolve(maxDate);

            }, function(error) {
                loadingservice.hide('errorHandler: ' + JSON.stringify(error));
                deferred.reject(error);
            });

            return deferred.promise;

        };

        //Get month of calandar!
        $scope.refreshCalendar = function() {
            //Lets get the PeriodEntries for the current user to create events.

            var filter = {
                start: $scope.startDate.toDate(),
                end: $scope.endDate.toDate()
            };

            loadingservice.show('refreshCalendar');

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
                loadingservice.hide('refreshCalendar_success');



            }, errorHandler);


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
            var modalInstance = UsernamePasswordModalService.getUsernamePasswordModal();
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
                        console.log('View Changed: ' + ' - ' + view.start.format('DD/MM/YYYY') + ' - ' + view.end.format('DD/MM/YYYY'));
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
