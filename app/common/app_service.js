'use strict';

// 'common service goes here';

angular.module('zideco.services', [
    'LocalStorageModule',
    'zideco.envconfig',
    'btford.socket-io',
    'ui.router'
])

.constant('version', '0.0.1')


.constant('zidecoEvents', {
    zevtAuthLoginatChanged: 'zevtAuthLoginatChanged',
    zevtAuthUserChanged: 'zevtAuthUserChanged'

})


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
            state: 'zideco.hours.currentmonth',
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
        //We will use this variable as a flag to let us know that we should NOT reset the last url.
        //If this variable is set, than we still have not had a successfull login.
        var _stillDirtyFromError;

        var setLoginError = function() {
            var currentLastUrl = getLastUrl();
            if (currentLastUrl) {
                currentLastUrl.loginerror = true;
            }
            _stillDirtyFromError = true;
            localStorageService.remove('lasturl');
            localStorageService.set('lasturl', _lasturl);
        };

        var setLastUrl = function(lastUrl) {
            var currentLastUrl = getLastUrl();
            if (currentLastUrl && currentLastUrl.loginerror) {
                console.log('Attempt to set lastUrl to: ' + lastUrl.state + '. But, we already have error state, so it is maintaned at: ' + currentLastUrl.state);
                return;
            }
            _lasturl = lastUrl;

            //Put user into localstorage so we can use it in interceptor, event after a redirect.
            localStorageService.remove('lasturl');
            localStorageService.set('lasturl', _lasturl);
            // console.log('Successfully set lastUrl to: ' + lastUrl.state);
        };

        var getLastUrl = function() {
            if (!_lasturl) {
                _lasturl = localStorageService.get('lasturl');
            }

            return _lasturl;
        };

        var getLastUrlBeforeError = function() {
            var lastUrl = getLastUrl();
            if (lastUrl && lastUrl.loginerror && !_stillDirtyFromError) {
                return lastUrl;
            }

            return undefined;
        };


        var clearLastUrl = function() {
            localStorageService.remove('lasturl');
            _lasturl = undefined;
        };


        //return API
        return {
            setLoginError: setLoginError,
            getLastUrlBeforeError: getLastUrlBeforeError,
            setLastUrl: setLastUrl,
            getLastUrl: getLastUrl,
            clearLastUrl: clearLastUrl
        };
    }
])



.factory('MessageIoSocket', ['$rootScope', 'socketFactory', 'CONFIG', function($rootScope, socketFactory, CONFIG) {
    var _started = false;
    var _theSocket;

    var events = {
        zEvtTesteIO: 'zEvtTesteIO',
        zEvtServiceRequestDone: 'zEvtServiceRequestDone',
        news: 'news'
    };


    var init = function() {
        if (_started === true) {
            return;
        }
        var socketUrl = CONFIG.BackendProtocol + '://' + CONFIG.host + CONFIG.BackendPort;

        var theSocket = io.connect(socketUrl, {
            path: CONFIG.SocketIOPath,
            query: 'token=' + 'token blabla'
        });

        var socketFactoryOptions = {
            ioSocket: theSocket
        };


        _theSocket = socketFactory(socketFactoryOptions);



        //Setup all events to be bubbled to angular event system.
        //With the "registerDirectSocketListener" I don't know if this makes any more sense!
        // var treatedEvents = [];

        // for (var property in events) {
        //     if (events.hasOwnProperty(property)) {
        //         treatedEvents.push({
        //             name: property
        //         });
        //     }
        // }

        // for (var i = 0; i < treatedEvents.length; i++) {
        //     mySocket.forward(treatedEvents[i].name, $rootScope);
        // }


        _started = true;
        return _theSocket;
    };

    var registerDirectSocketListener = function(zEvt, cb) {
        if (!_theSocket) {
            throw new Error('no socket ready');
        }

        _theSocket.on(zEvt, cb);
    };

    //return API
    return {
        init: init,
        events: events,
        registerDirectSocketListener: registerDirectSocketListener
    };


}])

.factory('Interceptors', ['$q',
    '$rootScope',
    'LASTURL',
    '$window',
    'zidecoEvents',
    function($q, $rootScope, LASTURL, $window, zidecoEvents) {
        return {
            'responseError': function(rejection) {
                console.log('interceptor runnning on rejection. rejection: ' + JSON.stringify(rejection));
                //Handle Errors
                switch (rejection.status) {
                    case 401:

                        if (rejection.data && rejection.data.loginat) {
                            //var url = rejection.config.url;
                            //Store url in localsession for future redirect.
                            // var lastUrl = LASTURL.getLastUrl();
                            // if (lastUrl) {
                            //     lastUrl.err = 401;
                            // }
                            //Set error for last url.
                            LASTURL.setLoginError();
                            // LASTURL.setLastUrl(lastUrl);
                            //go to login page.
                            // $state.go('zideco.landing');
                            console.log('Broadcasting event to login at...');
                            $rootScope.$broadcast(zidecoEvents.zevtAuthLoginatChanged, rejection.data.loginat);


                            //Go to landing page so we can log in...
                            // $window.location = rejection.data.loginat;
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


.factory('loadingservice', ['$rootScope', function($rootScope) {
    var showCounters = 0;
    var lodingEvents = {
        evtDone: 'evtDone',
        evtShow: 'evtShow',
    };
    var contextLogs = {};

    var hide = function(context) {
        if (--showCounters <= 0) {
            if (showCounters < 0) {
                console.log('Warning... Calling loadingService.hide() and showcounter is below zero... this should never happen. context: ' + context + ' showCounters: ' + showCounters + '\ncontextLogs:\n' + JSON.stringify(contextLogs));
            }
            showCounters = 0;

            $rootScope.$broadcast(lodingEvents.evtDone);
        }

    };

    var show = function(context) {
        contextLogs[context] = {
            before: showCounters,
            after: showCounters + 1
        };
        showCounters++;
        if (showCounters <= 0) {
            console.log('Warning... Calling loadingService.show() and showcounter equal to or below zero... this should never happen. context: ' + context + ' showCounters: ' + showCounters + '\ncontextLogs:\n' + JSON.stringify(contextLogs));
        }

        // console.log('Going to broadcast ' + lodingEvents.evtShow);
        $rootScope.$broadcast(lodingEvents.evtShow);
    };

    return {
        hide: hide,
        show: show,
        lodingEvents: lodingEvents
    };
}])

.factory('zidecoUtils', ['$rootScope', function($rootScope) {
    var getStandardErrorTreater = function(options) {
        var callbacks = [];
        if (options) {
            if (options.phaseController && options.phaseName) {
                callbacks.push(function() {
                    options.phaseController.finishPhase(options.phaseName);
                });
            }

        }

        return function(err) {
            if (!_.isEmpty(callbacks)) {
                _.forEach(function(cb) {
                    cb();
                });
            }
            console.log('Erro: ' + err);
        };
    };

    function PhaseController(name, phases, callbackOnFinished) {
        var self = this;
        this.phaseControllerName = name;
        this.callbackOnFinished = callbackOnFinished;
        if (_.isArray(phases)) {
            this.phases = _.zipObject(phases, _.fill(_.clone(phases), false));
        } else {
            this.phases = phases || {};
        }



        $rootScope.$on(PhaseController.events.evtPhaseComplete, function(event, valueObject) {
            var allPhasesComplete = false;
            if (valueObject.objeto === self.phaseControllerName) {
                //Vamos manter apenas uma etapa.
                allPhasesComplete = self.finalizaEtapa(valueObject.etapa);
            }

            if (allPhasesComplete && this.callbackOnFinished) {
                this.callbackOnFinished();
            }
        });
    }

    PhaseController.events = {
        evtPhaseComplete: 'evtPhaseComplete'
    };

    PhaseController.prototype = {
        checkAllPhasesComplete: function() {
            var self = this;
            for (var key in self.phases) {
                // console.log('checking phase: ' + key);
                // check also if property is not inherited from prototype
                if (self.phases.hasOwnProperty(key)) {
                    var value = self.phases[key];
                    if (value === false) {
                        return false;
                    }
                    // console.log('Phase ' + key + ' finished');
                }
            }

            if (self.callbackOnFinished) {
                self.callbackOnFinished();
            }

            return true;
        },

        finishPhase: function(phaseName) {
            var self = this;
            self.phases[phaseName] = true;
            return self.checkAllPhasesComplete();
        }


    };

    var getPhaseController = function(name, phases, callbackOnFinished) {
        return new PhaseController(name, phases, callbackOnFinished);

    };



    return {
        getStandardErrorTreater: getStandardErrorTreater,
        getPhaseController: getPhaseController
    };
}])




//Common objects:
.factory('ServiceRequestFactory', [function() {

    var ServicesCategories = {
        TimeEntryServices: {
            name: 'TimeEntryServices',
            functions: {
                processTimeEntriesClean: 'processTimeEntriesClean'
            }
        },
        TimeEntryScrapingServices: {
            name: 'TimeEntryScrapingServices',
            functions: {
                scrapeTimeEntriesClean: 'scrapeTimeEntriesClean'
            }
        },
        SequencedServicesService: {
            name: 'SequencedServicesService',
            functions: {
                runServices: 'runServices'
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
        this.createTimeEntryScrapingServiceRequest = function(username, password, startDate, endDate) {
            var params = {
                username: username,
                password: password,
                startDate: startDate,
                endDate: endDate
            };

            var service = new ServiceRequest(ServicesCategories.TimeEntryScrapingServices.name,
                ServicesCategories.TimeEntryScrapingServices.functions.scrapeTimeEntriesClean,
                params
            );

            return service;
        };

        this.createScrapeAndProcessSequenceServiceRequest = function(userId, username, password, startDate, endDate) {
            var scrapeService = this.createTimeEntryScrapingServiceRequest(username, password, startDate, endDate);
            var processEntryService = this.createProcessTimeEntryServiceRequest(userId, startDate, endDate);
            var params = {
                innerServiceRequestObjects: [scrapeService, processEntryService]
            };

            var service = new ServiceRequest(ServicesCategories.SequencedServicesService.name,
                ServicesCategories.SequencedServicesService.functions.runServices,
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

.factory('User', [function() {
    function User(userOrusername) {
        if (_.isString(userOrusername)) {
            this.username = userOrusername;
        } else {
            _.assign(this, userOrusername);
        }
    }

    User.prototype = {
        hasValidRole: function(code) {
            var self = this;
            if (!self.roles || self.roles.length <= 0) {
                return false;
            }
            var index = self.perfilIndex[code];
            if (!_.isUndefined(index)) {
                var historicoPerfil = self.roles[index];
                //Check if role is disabled
                if (historicoPerfil.perfil.disabled === true) {
                    return false;
                }

                //has valid role.
                return true;

            }

            return false;
        }
    };

    return (User);


}])


.factory('Auth', [
    '$rootScope',
    '$log',
    '$q',
    '$http',
    '$state',
    'localStorageService',
    'CONFIG',
    'User',
    'zidecoEvents',
    function($rootScope, $log, $q, $http, $state, localStorageService, CONFIG, User, zidecoEvents) {
        var _user = localStorageService.get('user');
        var _loginat;

        var getCurrentRemoteUser = function() {
            var deferred = $q.defer();
            $http({
                method: 'GET',
                url: CONFIG.BackendBaseUrl + 'usuariocorrente'
            }).
            success(function(data) {
                var user = new User(data);
                deferred.resolve(user);
            }).
            error(function(data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        };

        var setUser = function(user) {
            _user = user;

            //Put user into localstorage so we can use it in interceptor even after a redirect.
            localStorageService.set('user', _user);
            $rootScope.$broadcast(zidecoEvents.zevtAuthUserChanged, _user);
        };

        var getUser = function() {
            if (_.isUndefined(_user) || _.isNull(_user)) {
                getCurrentRemoteUser().then(function(data) {
                    setUser(data);
                    return _user;
                });
            } else {
                return _user;
            }

        };

        var setLoginAtURL = function(url) {
            console.log('going to setLoginAtURL with: ' + url);
            _loginat = url;
        };

        var getLoginAtURL = function() {
            console.log('going to getLoginAtURL. _loginat: ' + _loginat);
            return _loginat;
        };


        //return API
        return {
            getCurrentRemoteUser: getCurrentRemoteUser,
            setUser: setUser,
            getUser: getUser,
            setLoginAtURL: setLoginAtURL,
            getLoginAtURL: getLoginAtURL,


            logout: function() {
                var deferred = $q.defer();
                $http({
                    method: 'GET',
                    url: CONFIG.BackendBaseUrl + 'logout'
                }).
                success(function(data) {
                    _user = undefined;
                    localStorageService.remove('user');
                    deferred.resolve(data);
                    $state.go('zideco.landing', undefined, {
                        reload: true
                    });
                }).
                error(function(data) {
                    deferred.resolve(data);
                });

                return deferred.promise;
            }
        };
    }
])


;
