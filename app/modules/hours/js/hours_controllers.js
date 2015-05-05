/**
 * Created by raul on 05/06/14.
 */
'use strict';

//This is the controller for the "hours module" of the appliation.
angular.module('zideco.hourscontrollers', ['zideco.services', 'ui.calendar'])


.controller('hoursCtrlMain', ['$scope', 'ZModuleservice', function($scope, ZModuleservice) {
  console.log('Got to hours main controller');
  $scope.summaryEventSources = [];

  // var date = new Date();
  // var d = date.getDate();
  // var m = date.getMonth();
  // var y = date.getFullYear();
  
  $scope.events = [];
  // {
  //   title: 'All Day Event',
  //   start: new Date(y, m, 1)
  // }, {
  //   title: 'Long Event',
  //   start: new Date(y, m, d - 5),
  //   end: new Date(y, m, d - 2)
  // }, {
  //   id: 999,
  //   title: 'Repeating Event',
  //   start: new Date(y, m, d - 3, 16, 0),
  //   allDay: false
  // }, {
  //   id: 999,
  //   title: 'Repeating Event',
  //   start: new Date(y, m, d + 4, 16, 0),
  //   allDay: false
  // }, {
  //   title: 'Birthday Party',
  //   start: new Date(y, m, d + 1, 19, 0),
  //   end: new Date(y, m, d + 1, 22, 30),
  //   allDay: false
  // }, {
  //   title: 'Click for Google',
  //   start: new Date(y, m, 28),
  //   end: new Date(y, m, 29),
  //   url: 'http://google.com/'
  // }
  // ];

  // $scope.eventSource = {
  //             url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
  //             className: 'gcal-event',           // an option!
  //             currentTimezone: 'America/Chicago' // an option!
  //     };
  $scope.eventSources = [$scope.events];

  $scope.uiConfig = {
    calendar: {
      height: 450,
      editable: true,
      header: {
        left: 'month basicWeek basicDay agendaWeek agendaDay',
        center: 'title',
        right: 'today prev,next'
      },
      // dayClick: $scope.alertEventOnClick,
      // eventDrop: $scope.alertOnDrop,
      // eventResize: $scope.alertOnResize
    }
  };

}]);
