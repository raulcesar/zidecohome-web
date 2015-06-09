'use strict';

/* Filters */

angular.module('zideco.filters', [])
    .filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter('minutes', [function() {
        return function(minutes, zeroEsquerda) {
            if (!minutes) {
                return '';
            }

            zeroEsquerda = zeroEsquerda === undefined ? false : zeroEsquerda;
            if (minutes < 0) {
                minutes = 0;
            }
            var horas = Math.floor(minutes / 60);
            minutes = minutes % 60;

            var paddingminutes = '',
                paddinghoras = '';
            var separadorhoras = 'h. ';
            var separadorminutes = 'm.';
            if (zeroEsquerda) {
                paddinghoras = '000';
                paddingminutes = '0';
                separadorhoras = ':';
                separadorminutes = '';
            }


            return ((paddinghoras + (horas)).slice(-3) + separadorhoras + ((paddingminutes + (minutes)).slice(-2)) + separadorminutes);
        };
    }])

.filter('momentstandarddate', [function() {
    return function(moment, format) {
        if (!moment) {
            return '';
        }

        format = format || 'DD/MM/YYYY';
        return moment.format(format);
    };
}])

.filter('gravatarDefault', ['', function() {
    return function(text) {

        return (text || 'mm');
    };
}])

;
