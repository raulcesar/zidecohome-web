module.exports = function(config){
  config.set({
    basePath : 'devtools',
    exclude: [
      'app/pocs/**/*.*',
      'app/**/e2e/**/*'


    ],
    files : [
      'bower_components/angular/angular.js',
      'bower_components/angular-animate/angular-animate.min.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/datejs/build/date.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/restangular/dist/restangular.js',
      'bower_components/zepto/zepto.js',
      'bower_components/angular-gravatar/build/angular-gravatar.js',
      'bower_components/angular-gravatar/build/md5.js',
      'bower_components/angular-webstorage/angular-webstorage.js',
      'bower_components/angular-mocks/angular-mocks.js',


      'app/**/*.js'
    ],

    autoWatch : true,

    frameworks: ['jasmine'],

    browsers : ['Chrome'],

    plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine'
            ],

    junitReporter : {
      outputFile: 'test_out/unit.xml',
      suite: 'unit'
    }

  });
};