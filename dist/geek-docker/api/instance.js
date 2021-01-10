"use strict";
exports.__esModule = true;
exports.instance = void 0;
var axios_1 = require("axios");
var index_1 = require("../../option/index");
var data_1 = require("../data");
function instance() {
    var loginCache = data_1["default"].get("loginCache");
    return new Promise(function (resolve, reject) {
        index_1.getOption("geek-docker").then(function (paramsCache) {
            var serverUrl = paramsCache.serverUrl;
            axios_1["default"].get("http://" + serverUrl + "/api/v1/instance?page=1&limit=30&&id=&deploy_env=&creator=", {
                headers: { 'Authorization': loginCache.token }
            }).then(function (_a) {
                var data = _a.data;
                resolve(data);
            })["catch"](function (error) {
                reject(error);
            });
        });
    });
}
exports.instance = instance;
