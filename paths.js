/**
 * Created by raul on 04/06/14.
 */

module.exports = {
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


  vendorcss: ['./app/assets/style/external/**/*.css'],
  vendorsass: ['./app/assets/style/external/**/*.scss'],


  appcss: ['./app/assets/style/*.css'],
  appsass: ['./app/assets/style/*.scss'],

  vendorJS: [
    './bower_components/angular/angular.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-ui-router/release/angular-ui-router.min.js',
    './bower_components/datejs/build/date.js',
    './bower_components/lodash/dist/lodash.min.js',
    './bower_components/restangular/dist/restangular.min.js',
    './bower_components/zepto/zepto.min.js',
    './bower_components/angular-gravatar/build/*.min.js',
    './bower_components/angular-translate/*.min.js',

    //not minimized.....
    './bower_components/angular-webstorage/angular-webstorage.js'
  ],
  vendorMapFiles: [
    './bower_components/angular/angular.min.js.map'
  ],

  //TODO: Criar tratamento distinto para "libs js" que não estao minimizados.
  vendorCSS: ['!./bower_components/**/*.min.css', './bower_components/**/*.css'],
  build: './build',
  images: ['./app/**/*.ico', './app/**/*.jpg', './app/**/*.png', './app/**/*.jpeg'],
  mockFiles: ['./app/mockdata/**/*.json']
};

