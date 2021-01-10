"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.start = exports.CLI_NAME = void 0;
var chalk = require("chalk");
var inquirer = require("inquirer");
var api_1 = require("./api");
var index_1 = require("./../option/index");
var data_1 = require("./data");
exports.CLI_NAME = "geek + Docker 2.0 自动部署";
function start() {
    console.log("欢迎使用", chalk.dim.bold.blue(exports.CLI_NAME));
    index_1.getOption("geek-docker").then(function (option) {
        var makePrompts = [];
        if (!option.serverUrl) {
            makePrompts.push({
                type: "input",
                name: 'serverUrl',
                message: 'Docker ops地址(域名或IP):',
                "default": "devops.geekplus.cc",
                validate: function (value) {
                    if (/^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)(:\d{1,9})?$/.test(value) ||
                        /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(value)) {
                        return true;
                    }
                    return "请输入正确的IP或域名, 如172.0.0.1 或 devops.geekplus.cc";
                }
            });
        }
        if (!option.loginParams.email || !option.loginParams.password) {
            makePrompts.push({
                type: "input",
                name: 'email',
                message: '用户名(邮箱):',
                validate: function (value) {
                    return value ? true : "请填写用户名";
                }
            }, {
                type: "input",
                name: 'password',
                message: '密码:',
                transformer: function (value) {
                    return __spreadArrays(value).map(function (i) { return "*"; }).join("");
                },
                validate: function (value) {
                    return value ? true : "请填写密码";
                }
            });
        }
        if (makePrompts.length) {
            console.log(chalk.dim.red("您还未添加过关键配置, 请先添加 ↓"));
            inquirer.prompt(makePrompts).then(function (answers) {
                var newOption = {
                    serverUrl: answers.serverUrl,
                    loginParams: {
                        email: answers.email,
                        password: answers.password
                    }
                };
                index_1.setOption("geek-docker", newOption).then(function () {
                    console.log(chalk.dim.green("初始化成功 ~ "));
                    viewDockerCli();
                });
            });
        }
        else {
            viewDockerCli();
        }
    });
}
exports.start = start;
function loginDocker() {
    return api_1.login().then(function (_a) {
        var code = _a.code, data = _a.data;
        if (code === 200) {
            console.log(chalk.dim.bold.blue("[" + data["j-user"].name + "] \u767B\u5F55\u6210\u529F ~ "));
            data_1["default"].set("loginCache", data);
        }
    });
}
function viewDockerCli() {
    console.log(chalk.dim.bold.blue("准备登录 Docker Ops 2.0 系统"));
    loginDocker().then(function () {
        api_1.instance().then(function (data) {
            console.log(data);
        });
    });
}
