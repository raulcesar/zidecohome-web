
/**
 * Created by raul on 11/04/14.
 */
'use strict';

angular.module('zideco.directives', [
    'zideco.services'
    ])

.directive('backImg', function(){

    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'
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
        link: function(_scope, _element) {
            $timeout(function(){
                _element[0].focus();
            }, 0);
        }
    };
})


.directive('loading', ['loadingservice',  function(loadingservice) {
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
            scope.state = {visivel: false};


            scope.$on(loadingservice.lodingEvents.evtDone, function() {
                console.log('received event evtDone. Going to set satte.visivel to false');
                scope.state.visivel = false;
            });

            scope.$on(loadingservice.lodingEvents.evtShow, function() {
                scope.state.visivel = true;
            });

        },

    };
}])


;

