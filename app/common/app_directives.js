/**
 * Created by raul on 11/04/14.
 */
'use strict';

angular.module('zideco.directives', [
    'zideco.services'
])

.directive('backImg', function() {

    return function(scope, element, attrs) {
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value + ')'
            });
        });
    };
})

// .directive('autoFocus', function() {
//     return {
//         link: {
//             pre: function preLink(scope, element, attr) {
//                 console.debug('prelink called');
//                 // this fails since the element hasn't rendered
//                 //element[0].focus();
//             },
//             post: function postLink(scope, element, attr) {
//                 console.debug('postlink called');
//                 // this succeeds since the element has been rendered
//                 element[0].focus();
//             }
//         }
//     };
// })
.directive('autoFocus', function($timeout) {
    return {
        restrict: 'AC',
        replace: false,
        scope: {
            trigger: '=autoFocus'
        },
        link: function(scope, element, attrs) {
            if (attrs.autoFocus === '') {
                attrs.autoFocus = 'focusElement';
            }
            var focusElement = element[0];
            //Check if element is input
            if (focusElement.tagName !== 'INPUT') {
                
                focusElement = element.find('input:first');
                var test = focusElement.tagName;
                console.log(test);
            }


            scope.$watch('trigger', function(value) {
                if (value === true) {
                    $timeout(function() {
                        focusElement.focus();
                    }, 0);
                    console.log('Set trigger to false');
                    scope.trigger = false;
                }
            });
        }
    };
})


.directive('loading', ['loadingservice', function(loadingservice) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            options: '=?',
            state: '='
        },
        templateUrl: 'common/templates/loading.html',


        // link: function(scope, element, attrs) (assinatura completa)
        link: function(scope) {
            scope.options = scope.options || {
                text: 'Wait...'
            };
            scope.state = {
                visivel: false
            };


            scope.$on(loadingservice.lodingEvents.evtDone, function() {
                scope.state.visivel = false;
            });

            scope.$on(loadingservice.lodingEvents.evtShow, function() {
                scope.state.visivel = true;
            });

        },

    };
}])


;
