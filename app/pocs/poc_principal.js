/**
 * Created by raul on 07/10/2014
 */


/* Controllers */
'use strict';
var zidecopoc = angular.module('zideco.pocs', [
    'zideco.pocs.uistates',
    'ui.bootstrap',
    'angularFileUpload',
    'ezfb'
  ]
);

zidecopoc.config(function (ezfbProvider) {
  ezfbProvider.setInitParams({
    // This is my FB app id for plunker demo app
    appId: '265751283548576',
    xfbml      : true,

    // Module default is `v1.0`.
    // If you want to use Facebook platform `v2.0`, you'll have to add the following parameter.
    // https://developers.facebook.com/docs/javascript/reference/FB.init/v2.0
    version: 'v2.1'
  });
});


zidecopoc.controller('pocCtrl', ['$scope', 'MESSAGEIOSOCKET', 'ezfb', function ($scope, MESSAGEIOSOCKET, ezfb) {
  /**
   * Update loginStatus result
   */
  function updateLoginStatus (more) {
    ezfb.getLoginStatus(function (res) {
      $scope.loginStatus = res;

      (more || angular.noop)();
    });
  }

  /**
   * Update api('/me') result
   */
  function updateApiMe () {
    ezfb.api('/me', function (res) {
      $scope.apiMe = res;
    });
  }

  $scope.getname = function() {
    ezfb.api('/me', {fields: 'last_name'}, function(response) {
      console.log(response);
    });
  };


  updateLoginStatus(updateApiMe);




  $scope.message = {texto: ''};

  $scope.$on('socket:news', function (ev, data) {
    console.log(data);
    $scope.message = data;
  });

  $scope.$on('socket:error', function (ev, data) {
    var msg = 'ocorreu pau: ' + data;
    console.log(msg);
    $scope.message.texto   = msg;
  });

  $scope.mandaMensagem = function() {
    console.log('vou tentar emit');
    MESSAGEIOSOCKET.emit('chat', $scope.message.texto, function(message, error) {
      console.log('error:' + error);
      console.log('message: ' + JSON.stringify(message))
      $scope.message = message;
    });
  }
//  MESSAGEIOSOCKET.on('news', function (data) {
//    console.log(data);
//    $scope.message = data;
//  });

  var user = {'name': 'raul',
    'email':'raul.teixeira@gmail.com'
  };

  $scope.user = user;

  $scope.gridOptions = {
    data: [
      {
        "name": "Ethel Price",
        "gender": "female",
        "company": "Enersol"
      },
      {
        "name": "Claudine Neal",
        "gender": "female",
        "company": "Sealoud"
      },
      {
        "name": "Beryl Rice",
        "gender": "female",
        "company": "Velity"
      },
      {
        "name": "Wilder Gonzales",
        "gender": "male",
        "company": "Geekko"
      },
      {
        "name": "Georgina Schultz",
        "gender": "female",
        "company": "Suretech"
      },
      {
        "name": "Carroll Buchanan",
        "gender": "male",
        "company": "Ecosys"
      },
      {
        "name": "Valarie Atkinson",
        "gender": "female",
        "company": "Hopeli"
      },
      {
        "name": "Schroeder Mathews",
        "gender": "male",
        "company": "Polarium"
      },
      {
        "name": "Lynda Mendoza",
        "gender": "female",
        "company": "Dogspa"
      },
      {
        "name": "Sarah Massey",
        "gender": "female",
        "company": "Bisba"
      },
      {
        "name": "Robles Boyle",
        "gender": "male",
        "company": "Comtract"
      },
      {
        "name": "Evans Hickman",
        "gender": "male",
        "company": "Parleynet"
      },
      {
        "name": "Dawson Barber",
        "gender": "male",
        "company": "Dymi"
      },
      {
        "name": "Bruce Strong",
        "gender": "male",
        "company": "Xyqag"
      },
      {
        "name": "Nellie Whitfield",
        "gender": "female",
        "company": "Exospace"
      },
      {
        "name": "Jackson Macias",
        "gender": "male",
        "company": "Aquamate"
      },
      {
        "name": "Pena Pena",
        "gender": "male",
        "company": "Quarx"
      },
      {
        "name": "Lelia Gates",
        "gender": "female",
        "company": "Proxsoft"
      },
      {
        "name": "Letitia Vasquez",
        "gender": "female",
        "company": "Slumberia"
      },
      {
        "name": "Trevino Moreno",
        "gender": "male",
        "company": "Conjurica"
      }
    ]
  };
//
//  data: [
//      {name: 'raul', ponto: '6486'},
//      {name: 'faa', ponto: 'foo'},
//      {name: 'fee', ponto: 'fi'},
//      {name: 'fo', ponto: 'fum'},
//    ]
//  };



}]);



