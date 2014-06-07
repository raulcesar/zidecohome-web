/**
 * Created by raul on 11/04/14.
 */
var appDirectives = angular.module('zideco.directives', []);

appDirectives.directive('backImg', function(){
    'use strict';

    return function(scope, element, attrs){
        attrs.$observe('backImg', function(value) {
            element.css({
                'background-image': 'url(' + value +')'
            });
        });
    };
});
