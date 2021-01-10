"use strict";
exports.__esModule = true;
exports.setOption = exports.getOption = void 0;
var fs = require("fs");
var path = require("path");
function getOption(optName) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, 'option.json'), "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var option = JSON.parse(data);
                resolve(optName ? option[optName] : option);
            }
        });
    });
}
exports.getOption = getOption;
function setOption(optName, optData) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path.join(__dirname, 'option.json'), "utf8", function (err, data) {
            if (err) {
                reject(err);
            }
            else {
                var option_1 = JSON.parse(data);
                Object.keys(optData).forEach(function (key) {
                    option_1[optName][key] = optData[key];
                });
                fs.writeFile(path.join(__dirname, 'option.json'), JSON.stringify(option_1), function (err) {
                    resolve(void 0);
                });
            }
        });
    });
}
exports.setOption = setOption;
