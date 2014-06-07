var HtmlReporter = require('protractor-html-screenshot-reporter');
var paths = require('./paths');


exports.config = {



  allScriptsTimeout: 11000,
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.41.0.jar',
  specs: [
    paths.testes.e2e
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  chromeOnly: true,

  baseUrl: 'http://localhost:9000/',
  chromeDriver: './node_modules/protractor/selenium/chromedriver',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },


  onPrepare: function() {
    // Add a screenshot reporter and store screenshots to `/tmp/screnshots`:
    jasmine.getEnv().addReporter(new HtmlReporter({
      baseDirectory: paths.testes.reports

    }));
  }
};
