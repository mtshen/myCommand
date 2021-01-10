"use strict";
exports.__esModule = true;
exports.login = void 0;
var axios_1 = require("axios");
var option_1 = require("../../option");
function login(params) {
    if (params === void 0) { params = {}; }
    return new Promise(function (resolve, reject) {
        option_1.getOption("geek-docker").then(function (paramsCache) {
            var serverUrl = paramsCache.serverUrl, loginParams = paramsCache.loginParams;
            axios_1["default"].post("http://" + serverUrl + "/api/v1/login", {
                email: params.email || loginParams.email,
                password: params.password || loginParams.password
            }).then(function (request) {
                console.log(request);
                debugger;
                resolve(request.data);
            })["catch"](function (error) {
                reject(error);
            });
        });
    });
}
exports.login = login;
