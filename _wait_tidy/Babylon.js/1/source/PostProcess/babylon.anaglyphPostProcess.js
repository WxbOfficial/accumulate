"use strict";

var BABYLON = BABYLON || window.BABYLON || {};

(function () {
    BABYLON.AnaglyphPostProcess = function (name, ratio, camera, samplingMode, engine, reusable) {
        BABYLON.PostProcess.call(this, name, "anaglyph", null, ["leftSampler"], ratio, camera, samplingMode, engine, reusable);
    };

    BABYLON.AnaglyphPostProcess.prototype = Object.create(BABYLON.PostProcess.prototype);

})();