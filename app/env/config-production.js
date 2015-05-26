/**
 * Created by raul on 5/13/14.
 */
var config = angular.module('zideco.envconfig', []);

config.constant('CONFIG', {
	BackendProtocol: 'http',
	BackendPort: '',
	BackendBasePath: 'zidecoapi/',

    BackendBaseUrl: 'http://zideco.org/zidecoapi/',
    RestangularBaseUrl: 'http://zideco.org/zidecoapi',
    MessageIoSocketUrl: 'http://zideco.org/zidecoapi'

});
