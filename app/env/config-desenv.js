/**
 * Created by raul on 5/13/14.
 */
var config = angular.module('zideco.envconfig', []);

config.constant('CONFIG', {
	BackendProtocol: 'http',
	BackendPort: ':3032',
	BackendBasePath: '',
    BackendBaseUrl: 'http://localhost:3032/',
    RestangularBaseUrl: 'http://localhost:3032/',
    MessageIoSocketUrl: 'http://localhost:3032',
});
