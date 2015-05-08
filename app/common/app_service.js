'use strict';

// 'common service goes here';

angular.module('zideco.services', ['LocalStorageModule'])

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
            var newCurrentModule = _stateToModuleMap[state];

            if (_currentModule !== newCurrentModule) {
                _currentModule = newCurrentModule;
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

.factory('LASTURL', ['$log', 'localStorageService',
    function($log, localStorageService) {
        var _lasturl = localStorageService.get('lasturl');

        var setLastUrl = function(lastUrl) {
            _lasturl = lastUrl;

            //Put user into localstorage so we can use it in interceptor.
            localStorageService.remove('lasturl');
            localStorageService.set('lasturl', _lasturl);
        };

        var getLastUrl = function() {
            var lasturl = localStorageService.get('lasturl');
            if (lasturl) {
                _lasturl = lasturl;
            }
            return _lasturl;
        };

        var clearLastUrl = function() {
            localStorageService.remove('lasturl');
            _lasturl = null;
        };


        //return API
        return {
            setLastUrl: setLastUrl,
            getLastUrl: getLastUrl,
            clearLastUrl: clearLastUrl
        };
    }
])



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

.factory('Interceptors', ['$q', '$rootScope', '$log', 'LASTURL', '$window',
    function($q, $rootScope, $log, LASTURL, $window) {
        return {
            'responseError': function(rejection) {
                $log.info('interceptor authInterceptor at your service. ERROR');
                //Handle Errors
                switch (rejection.status) {
                    case 401:
                        if (rejection.data && rejection.data.loginat) {
                            //var url = rejection.config.url;
                            //Store url in localsession for future redirect.
                            var lastUrl = LASTURL.getLastUrl();
                            if (lastUrl) {
                                lastUrl.err = 401;
                            }
                            LASTURL.setLastUrl(lastUrl);
                            //go to login page.
                            $window.location = rejection.data.loginat;
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
    }
])


//Common objects:
.factory('ServiceRequestFactory', [function() {

    var ServicesCategories = {
        TimeEntryServices: {
            name: 'TimeEntryServices',
            functions: {
                processTimeEntriesClean: 'processTimeEntriesClean'
            }
        }
    };


    function ServiceRequestFactory() {
        this.createProcessTimeEntryServiceRequest = function(userId, startDate, endDate) {

            var params = {
                userId: userId,
                startDate: startDate,
                endDate: endDate
            };

            var service = new ServiceRequest(ServicesCategories.TimeEntryServices.name,
                ServicesCategories.TimeEntryServices.functions.processTimeEntriesClean,
                params
            );

            return service;
        };
    }

    function ServiceRequest(category, name, parameters) {
        this.serviceCategory = category;
        this.serviceName = name;
        this.serviceParameters = parameters;
    }




    // ServiceRequest.prototype = {
    // };

    return (new ServiceRequestFactory());


}])

;

