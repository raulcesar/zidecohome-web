'use strict';

describe("main_controller_specs", function(){
    beforeEach(module('zideco.main'));
    var scope,
        mainController;

    beforeEach(
        inject(function($controller) {
            scope = {};
            mainController = $controller("mainCtrl", {$scope:scope});
        })
    );

    it("deve ter um nome de modulo", function(){
        expect(scope.nomeModulo).toBeDefined();
    });

    it("deve ter um usuario", function() {
        expect(scope.user).toBeDefined();
        expect(scope.user.email).toBeDefined();
        expect(scope.user.name).toBeDefined();
        expect(scope.user.ponto).toBeDefined();
    });
})