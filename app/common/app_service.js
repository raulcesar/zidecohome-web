'common service goes here';

var zidecoServices = angular.module('zideco.services', [])
  .constant('version', '0.0.1');


zidecoServices
  .factory('LASTURL', ['$log', 'webStorage',  function($log, webStorage) {
    var _lasturl = webStorage.session.get('lasturl');
    var _lastTryError = undefined;

    var setLasturl = function(lastUrl) {
      _lasturl = lastUrl

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
;


zidecoServices.factory('MESSAGEIOSOCKET', ['socketFactory', 'CONFIG', function (socketFactory, CONFIG) {
  var mySocket = socketFactory({
      ioSocket: io.connect(CONFIG.MessageIoSocketUrl, {query: 'token=' + 'blabla'})
  });

  mySocket.forward('news');
  mySocket.forward('error');
  return mySocket;
}]);



zidecoServices.factory('Interceptors', ['$q', '$rootScope', '$log', 'LASTURL', '$location', function($q, $rootScope, $log, LASTURL, $location) {
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
      switch(rejection.status) {
        case 401:
          if (rejection.data.loginat) {
            var url = rejection.config.url;
            //Store url in localsession for future redirect.
            var lastUrl = LASTURL.getLasturl()
            if (lastUrl) {
              lastUrl.err = '401';
            }
            LASTURL.setLasturl(lastUrl);


            //go to login page.
            window.location = rejection.data.loginat;
//              window.location = rejection.data.loginat + '?destination=' + url;
          }
          break;
        case 403: $rootScope
          .$broadcast('auth:forbidden'); break;
        case 404: $rootScope
          .$broadcast('page:notFound'); break;
        case 500: $rootScope
          .$broadcast('server:error'); break;
      }
      return $q.reject(rejection);
    }
  };
}]);