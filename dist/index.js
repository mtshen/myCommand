"use strict";
exports.__esModule = true;
var chalk = require("chalk");
var figlet = require("figlet");
var inquirer = require("inquirer");
var geekDocker = require("./geek-docker");
require("./option/axiosConf");
var cliAll = [geekDocker];
console.clear();
console.log(chalk.dim.bold.blue(figlet.textSync("Geek + Cli", { horizontalLayout: "default", verticalLayout: "default" })), "\r\n", chalk.dim.bold.blue("mtshen v1.0"));
inquirer
    .prompt([
    {
        type: 'rawlist',
        name: 'selCliType',
        message: '以下功能可用:',
        choices: cliAll.map(function (cliItem) { return ({
            name: cliItem.CLI_NAME,
            value: cliItem
        }); })
    },
])
    .then(function (answers) {
    answers.selCliType.start();
    return answers.selCliType.CLI_NAME;
});
