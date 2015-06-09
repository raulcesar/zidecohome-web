'use strict';
angular.module('zideco.pocs.autofocus', [
    'ui.bootstrap',
    'ui.router',
    'zideco.directives.actionbar',
    'zideco.services',
    'zideco.commonmodals',
    'zideco.hours.services',
    // 'zideco.common.reposervices',
    'zideco.hours.reposervices',
    'zideco.filters',
    'zideco.directives',
    'angularGrid',
    'ui.mask'
])

.controller('pocAutoFocusCtrl', ['$scope', '$timeout', function($scope, $timeout) {
	$scope.focusStart = true;
	$scope.focusUserName = false;
	$scope.focusEnd = false;

	$scope.endChanged = function() {
		console.log('endChanged called');
	};

	$scope.curentTimePeriodInput = {};
	$scope.setfocusUser = function() {
		$scope.focusUserName = true;
	};
	$scope.setfocusEnd = function() {
		$scope.focusEnd = true;
		$timeout(function() {
			$scope.focusEnd = false;

		}, 0);
	};

}]);


