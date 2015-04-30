'use strict';

// 'common service goes here';

angular.module('zideco.services', [])

.constant('version', '0.0.1')


.provider('ZModuleservice', function() {
  var _events = {
    evtCurrentModuleChanged: 'evtCurrentModuleChanged'
  };

  var _modules = {
    landing: {
      order: 0,
      name: 'landing',
      title: 'Zideco Web',
      state: 'zideco.landing',
      formatingClasses: ['fa-home']
    },

    hours: {
      order: 1,
      name: 'hours',
      title: 'Hours',
      state: 'zideco.hours',
      formatingClasses: ['fa-clock-o']
    },
    finance: {
      order: 2,
      name: 'finance',
      title: 'Finance',
      state: 'zideco.finance',
      formatingClasses: ['fa-dollar']
    },
    secnotes: {
      order: 3,
      name: 'secnotes',
      title: 'Secure Notes',
      state: 'zideco.landing', //TODO: need to implement
      formatingClasses: ['fa-lock']
    },
    hr: {
      order: 4,
      name: 'hr',
      title: 'Human Resources',
      state: 'zideco.landing', //TODO: need to implement
      formatingClasses: ['fa-group']
    },
    pref: {
      order: 5,
      name: 'pref',
      title: 'Preferences',
      state: 'zideco.landing', //TODO: need to implement
      formatingClasses: ['fa-cogs']
    },
    user: {
      order: 6,
      name: 'user',
      title: 'TODO: User name',
      state: 'zideco.landing', //TODO: need to implement
      formatingClasses: ['fa-user']
    }
  };
  var _currentModule;
  var _modulesArray = _.sortBy(_.values(_modules), 'order');


  var _stateToModuleMap = {

  };

  //Api for PROVIDER
  var registerStateToModuleRelation = function(state, module) {
    _stateToModuleMap[state] = _modules[module];
  };

  this.registerStateToModuleRelation = registerStateToModuleRelation;
  this.fuck = function() {
    console.log('fuck');
  };

  this.$get = ['$rootScope', function($rootScope) {
    var getAllModules = function() {
      return _modules;
    };

    //This function sets the current module and emits an event to indicate the change.
    var setCurrentModule = function(state) {
      console.log('current state: ' + state);
      var newCurrentModule = _stateToModuleMap[state];

      if (_currentModule !== newCurrentModule) {
        _currentModule = newCurrentModule;
        console.log('Broadcasting event for new module...' + JSON.stringify(_currentModule));

        $rootScope.$broadcast(_events.evtCurrentModuleChanged, _currentModule);
      }
    };
    var getCurrentModule = function() {
      return _currentModule;
    };
    var getModulesArray = function(removeCurrentModule) {
      if (removeCurrentModule) {
        return _.filter(_modulesArray, function(module) {
          return module !== _currentModule;
        });
      }

      return _modulesArray;
    };

    return {
      events: _events,
      getCurrentModule: getCurrentModule,
      setCurrentModule: setCurrentModule,
      getAllModules: getAllModules,
      getModulesArray: getModulesArray,
      registerStateToModuleRelation: registerStateToModuleRelation
    };
  }];

})

// .factory('ZModuleservice', ['$rootScope', function($rootScope) {
//     var _events = {
//         evtCurrentModuleChanged: 'evtCurrentModuleChanged'
//     };

//     var _modules = {
//         landing: {
//             name: 'landing',
//             title: 'Zideco Web',
//             state: 'zideco.landing',
//             formatingClasses: ['zideco-brand']
//         },

//         hours: {
//             name: 'hours',
//             title: 'Hours',
//             state: 'zideco.hours',
//             formatingClasses: ['fa-clock-o']
//         },
//         finance: {
//             name: 'finance',
//             title: 'Finance',
//             state: 'zideco.finance',
//             formatingClasses: ['fa-dollar']
//         },
//         secnotes: {
//             name: 'secnotes',
//             title: 'Secure Notes',
//             state: 'zideco.landing', //TODO: need to implement
//             formatingClasses: ['fa-lock']
//         },
//         hr: {
//             name: 'hr',
//             title: 'Human Resources',
//             state: 'zideco.landing', //TODO: need to implement
//             formatingClasses: ['fa-group']
//         },
//         pref: {
//             name: 'pref',
//             title: 'Preferences',
//             state: 'zideco.landing', //TODO: need to implement
//             formatingClasses: ['fa-cogs']
//         },
//         user: {
//             name: 'user',
//             title: 'TODO: User name',
//             state: 'zideco.landing', //TODO: need to implement
//             formatingClasses: ['fa-user']
//         }
//     };
//     var _currentModule;


//     var _stateToModuleMap = {

//     };

//     var registerStateToModuleRelation = function(state, module) {
//         _stateToModuleMap[state] = _modules[module];
//     };

//     var getAllModules = function() {
//         return _modules;
//     };

//     //This function sets the current module and emits an event to indicate the change.
//     var setCurrentModule = function(state) {
//         console.log('current state: ' + state);
//         var newCurrentModule = _stateToModuleMap[state];

//         if (_currentModule !== newCurrentModule) {
//             _currentModule = newCurrentModule;
//             $rootScope.$broadcast(_events.evtCurrentModuleChanged, _currentModule);
//         }
//     };
//     var getCurrentModule = function() {
//         return _currentModule;
//     };


//     //return api
//     return {
//         getCurrentModule: getCurrentModule,
//         setCurrentModule: setCurrentModule,
//         getAllModules: getAllModules,
//         registerStateToModuleRelation: registerStateToModuleRelation
//     };
// }])

.factory('LASTURL', ['$log', 'webStorage', function($log, webStorage) {
  var _lasturl = webStorage.session.get('lasturl');
  // var _lastTryError;

  var setLasturl = function(lastUrl) {
    _lasturl = lastUrl;

    //Put user into localstorage so we can use it in interceptor.
    webStorage.session.remove('lasturl');
    webStorage.session.add('lasturl', _lasturl);

  };


  //return API
  return {
    setLasturl: setLasturl,
    getLasturl: function() {
      var lasturl = webStorage.session.get('lasturl');
      if (lasturl) {
        _lasturl = lasturl;
      }
      return _lasturl;
    },

    clearLastUrl: function() {
      webStorage.session.remove('lasturl');
      _lasturl = null;
    }
  };
}])


.factory('MESSAGEIOSOCKET', ['socketFactory', 'CONFIG', function(socketFactory, CONFIG) {
  var mySocket = socketFactory({
    ioSocket: io.connect(CONFIG.MessageIoSocketUrl, {
      query: 'token=' + 'blabla'
    })
  });

  mySocket.forward('news');
  mySocket.forward('error');
  return mySocket;
}])



.factory('Interceptors', ['$q', '$rootScope', '$log', 'LASTURL', function($q, $rootScope, $log, LASTURL) {
  return {
    //    'request': function(config) {
    ////      LASTURL.setLasturl({url: config.url});
    //      return config || $q.when(config);
    //    },

    //    'requestError': function(rejection) {
    //      // do something on error
    //      return $q.reject(rejection);
    //    },



    //    'response': function(response) {
    //      $log.info('Url: ' + response.config.url);
    //
    //      //Guarda ultimo url
    //
    //      var lastUrl = LASTURL.getLasturl()
    //      if (lastUrl && lastUrl.err) {
    //        LASTURL.clearLastUrl();
    //        //Redirect to lasturl.
    //        $location.path(lastUrl.url);
    //      }
    //      return response;
    //    },

    // optional method
    'responseError': function(rejection) {
      $log.info('interceptor authInterceptor at your service. ERROR');
      console.log(rejection);
      //Handle Errors
      switch (rejection.status) {
        case 401:
          if (rejection.data.loginat) {
            // var url = rejection.config.url;
            //Store url in localsession for future redirect.
            var lastUrl = LASTURL.getLasturl();
            if (lastUrl) {
              lastUrl.err = '401';
            }
            LASTURL.setLasturl(lastUrl);


            //go to login page.
            window.location = rejection.data.loginat;
            //              window.location = rejection.data.loginat + '?destination=' + url;
          }
          break;
        case 403:
          $rootScope
            .$broadcast('auth:forbidden');
          break;
        case 404:
          $rootScope
            .$broadcast('page:notFound');
          break;
        case 500:
          $rootScope
            .$broadcast('server:error');
          break;
      }
      return $q.reject(rejection);
    }
  };
}]);
