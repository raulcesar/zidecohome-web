/**
 * Created by raul on 5/13/14.
 */
var config = angular.module('zideco.envconfig', []);

config.constant('CONFIG', {
  RestangularBaseUrl: 'http://localhost:3030/',
  MessageIoSocketUrl: 'http://localhost:3030'
});
