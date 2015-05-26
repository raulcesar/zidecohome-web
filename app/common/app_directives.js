
/**
 * Created by raul on 11/04/14.
 */
'use strict';

angular.module('zideco.directives', ['zideco.services'])

.directive('backImg', function(){

    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'
            });
        });
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
                scope.state.visivel = false;
            });

            scope.$on(loadingservice.lodingEvents.evtShow, function() {
                scope.state.visivel = true;
            });

        },

    };
}])


;

