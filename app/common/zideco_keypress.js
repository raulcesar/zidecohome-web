'use strict';

angular.module('zideco.directives.keypress', [])


/**
 * Bind one or more handlers to particular keys or their combination
 **/
.directive('zidecoKey', [
    '$document',
    '$q',
    function($document) {
        var keysByCode = {
            8: 'backspace',
            9: 'tab',
            13: 'enter',
            27: 'esc',
            32: 'space',
            33: 'pageup',
            34: 'pagedown',
            35: 'end',
            36: 'home',
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down',
            45: 'insert',
            46: 'delete'
        };


        var binderMcGee = function(scope, configObj) {
            return function(event) {


                // No need to do that inside the cycle
                var metaPressed = !!(event.metaKey && !event.ctrlKey);
                var altPressed = !!event.altKey;
                var ctrlPressed = !!event.ctrlKey;
                var shiftPressed = !!event.shiftKey;
                var keyCode = event.keyCode;

                // normalize keycodes
                if (configObj.mode === 'keypress' && !shiftPressed && keyCode >= 97 && keyCode <= 122) {
                    keyCode = keyCode - 32;
                }

                var strFromKeycode = String.fromCharCode(keyCode);

                // Iterate over prepared combinations
                angular.forEach(configObj.combinations, function(combination) {

                    //Check if main key (without modifiers) was pressed
                    var mainKeyPressed =
                        (keysByCode[keyCode] === combination.key) ||
                        (strFromKeycode.trim().toUpperCase() === combination.key.trim().toUpperCase());


                    var metaRequired = !!combination.meta;
                    var altRequired = !!combination.alt;
                    var ctrlRequired = !!combination.ctrl;
                    var shiftRequired = !!combination.shift;

                    //If what was pressed is the same as the specified combo, call the callback
                    if (
                        mainKeyPressed &&
                        (metaRequired === metaPressed) &&
                        (altRequired === altPressed) &&
                        (ctrlRequired === ctrlPressed) &&
                        (shiftRequired === shiftPressed)
                    ) {
                        console.log('hey hey');
                        scope.$apply(function() {
                            configObj.callback(event);
                        });
                    }
                });

            };

        };


        return {
            link: function(scope, elm, attrs) {
                // console.log('Calling link function');

                function unbindAll() {
                    angular.forEach(scope[attrs.objconfig], function(configObj) {
                        if (configObj.bindOn) {
                            $document.unbind(configObj.mode, configObj.bindingFunc);
                        }
                    });
                }



                function updateBinding(configObj) {
                    if (configObj.bindOn) {
                        var func = binderMcGee(scope, configObj);
                        $document.bind(configObj.mode, func);
                        configObj.bindingFunc = func;
                    } else {
                        $document.unbind(configObj.mode, configObj.bindingFunc);
                    }
                }

                function updateAllBindings(configArray) {
                    angular.forEach(configArray, function(objconfig) {
                        if (objconfig.beingWatched) {
                            return;
                        }

                        // console.log('Found object that isnt being watched.: ' + JSON.stringify(configArray));
                        updateBinding(objconfig);
                    });
                }

                //When the scope is cleared, unbind all keypresses.
                elm.on('$destroy', function() {
                    unbindAll();
                });


                //Vamos configurar um watcher para cada objeto no vetor de configuracao, para que possamos alterar uma
                //propriedade dele e assim, modificar o comportamento. Porem, vamos tambem monitorar o proprio vetor, para que possamos
                //incluir novos acionadores dinamicamente.

                //Setup watchers. We will be watching the configuration array as well as each object within the array. Thus we have a call to updateAllBindins
                //inside the "array" watcher.

                //Still, for the FIRST setup, call updateAllBindings from without so we can compare newval and oldval inside the array watcher.
                updateAllBindings(scope[attrs.objconfig]);

                //Watch the main array (with config objects);
                scope.$watch(attrs.objconfig, function(newval, oldval) {
                    if (angular.equals(newval, oldval)) {
                        return;
                    }

                    // console.log('identified a change! Watcher called. oldval: ' + JSON.stringify(oldval) + '\nnewval: ' + JSON.stringify(newval));
                    updateAllBindings(newval);
                }, true);
            }
        };
    }
]);
