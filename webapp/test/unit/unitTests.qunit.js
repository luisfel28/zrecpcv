/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"fidelidademundial/com/zrecpcv/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
