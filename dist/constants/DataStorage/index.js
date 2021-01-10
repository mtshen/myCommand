"use strict";
exports.__esModule = true;
var DataStorage = (function () {
    function DataStorage() {
        this.data = {};
    }
    DataStorage.prototype.set = function (key, option) {
        this.data[key] = option;
    };
    DataStorage.prototype.get = function (key) {
        return this.data[key];
    };
    return DataStorage;
}());
exports["default"] = DataStorage;
