'use strict';

angular.module('zideco.directives.actionbar', [
    'zideco.services'
    ])

.directive('zidecoActionBar', function() {
    return {
        restrict: 'EA',
        //require: '^ngModel',
        scope: {
            barOptions: '=?',
            barStyle: '=?',
            extraBarStyles: '=?',
            barTitle: '=?',

            editActive: '&',
            newItem: '&',
            deleteActive: '&',
            printActive: '&',
            saveActive: '&'
        },
        templateUrl: 'common/templates/actionbar.html',
        controller: function($scope) {
            if ($scope.barOptions === undefined) {
                $scope.barOptions = {};
            }


            _.defaults($scope.barOptions, {
                allowEdit: false,
                allowSave: false,
                allowDelete: false,
                allowNew: true,
                allowPrint: false,
                hideEdit: false,
                hideSave: false,
                hideDelete: false,
                hideNew: false,
                hidePrint: true
            });

            var defaultStyles = ['col-xs-12', 'col-md-10',  'zideco-actionbar'];
            if ($scope.extraBarStyles) {
                if (_.isArray($scope.extraBarStyles)) {
                    defaultStyles = defaultStyles.concat($scope.extraBarStyles);
                } else if (_.isString($scope.extraBarStyles)) {
                    defaultStyles.push($scope.extraBarStyles);
                }

            }

            $scope.barStyle = $scope.barStyle || defaultStyles;



            $scope.executeAction = function(action, check) {
                if (check) {
                    action();
                }
            };

        }
    };
});