'use strict';

/* Filters */

angular.module('zideco.filters', [])
    .filter('interpolate', ['version', function (version) {
        return function (text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter('minutosFiltro', [function () {
        return function (minutos, zeroEsquerda) {
            if (!minutos) {
                return '';
            }

            zeroEsquerda = zeroEsquerda === undefined ? false : zeroEsquerda;
            if (minutos < 0) {
                minutos = 0;
            }
            var horas = Math.floor(minutos / 60);
            minutos = minutos % 60;

            var paddingminutos = '', paddinghoras = '';
            var separadorhoras = 'h. ';
            var separadorminutos = 'm.';
            if (zeroEsquerda) {
                paddinghoras = '000';
                paddingminutos = '0';
                separadorhoras = ':';
                separadorminutos = '';
            }


            return ((paddinghoras + (horas)).slice(-3) + separadorhoras + ((paddingminutos + (minutos)).slice(-2)) + separadorminutos);
        };
    }])
    .filter('gravatarDefault', ['', function() {
        return function (text) {

            return (text || 'mm');
        };
    }])

;
