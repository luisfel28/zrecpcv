/*global QUnit*/

sap.ui.define([
	"fidelidademundial/com/zrecpcv/controller/contratos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("contratos Controller");

	QUnit.test("I should test the contratos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
