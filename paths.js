/**
 * Created by raul on 04/06/14.
 */

var paths = {
    index: ['./app/index.html', './app/test.html' ],

    scripts: [
        '!./app/**/*_test.js',
        '!./app/**/*_spec.js',
        '!./app/**/*Spec.js',
        '!./app/templates-dummy.js',
        '!./app/env/**/*',
        '!./app/pocs/**/*',
        '!./app/**/e2e/**/*',
        '!./app/**/*_mock*.js',


        './app/**/*.js'
    ],

    testes: {
        e2e: './app/**/e2e/**/*.js',
        reports: './testReports'
    },

    envConfigFiles: {
        production: ['./app/env/*production.js'],
        development: ['./app/env/*desenv.js']
    },

    templates: ['!./app/index.html', './app/**/*.html'],


  vendorcss: [
        './app/assets/style/external/**/*.css',
      //TODO: quando o UI-GRID vier do bower, temos que colocar abaixo.
        './bower_components/angular-ui-grid/ui-grid.min.css'
    ],
    vendorsass: ['./app/assets/style/external/**/*.scss'],


    appcss: ['./app/assets/style/app/**/*.css'],
    appsass: ['./app/assets/style/app/**/*.scss'],

    vendorJS: [
        './bower_components/ng-file-upload/angular-file-upload-html5-shim.min.js',
        './bower_components/angular/angular.min.js',
        './bower_components/angular-animate/angular-animate.min.js',
        './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        './bower_components/angular-ui-router/release/angular-ui-router.min.js',
        './bower_components/datejs/build/date.js',
        './bower_components/lodash/dist/lodash.min.js',
        './bower_components/restangular/dist/restangular.min.js',
        './bower_components/jquery/dist/jquery.min.js',
        './bower_components/angular-gravatar/build/*.min.js',
      //TODO: quando o UI-GRID vier do bower, temos que colocar abaixo.
        './bower_components/angular-ui-grid/ui-grid.min.js',

        './bower_components/angular-sanitize/angular-sanitize.min.js',
        './bower_components/ng-file-upload/angular-file-upload.min.js',

        //not minimized.....
        './bower_components/angular-webstorage/angular-webstorage.js'
    ],
    vendorMapFiles: [
        './bower_components/angular/angular.min.js.map',
        './bower_components/angular-sanitize/angular-sanitize.min.js.map'
    ],

    //TODO: Criar tratamento distinto para "libs js" que não estao minimizados.
    build: './build',
    images: ['./app/**/*.ico', './app/**/*.jpg', './app/**/*.png', './app/**/*.jpeg'],
    mockFiles: ['./app/mockdata/**/*.json']
};

paths.buildfonts = paths.build + '/assets/fonts';

//The uigrid needs special consideration.
//paths.uigridfonts = [
//  './app/assets/style/external/ui-grid/*.eot',
//    './app/assets/style/external/ui-grid/*.svg',
//    './app/assets/style/external/ui-grid/*.ttf',
//    './app/assets/style/external/ui-grid/*.woff'
//];

//TODO: quando o UI-GRID vier do bower, temos que colocar abaixo. e comentar acima.
paths.uigridfonts = [
  './bower_components/angular-ui-grid/*.eot',
  './bower_components/angular-ui-grid/*.svg',
  './bower_components/angular-ui-grid/*.ttf',
  './bower_components/angular-ui-grid/*.woff'
];

paths.uigridbuildfonts = paths.build;



module.exports = paths;