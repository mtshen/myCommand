// 终端色彩
import * as chalk from "chalk";
import * as figlet from "figlet";
import * as inquirer from "inquirer";

// 内容
import * as geekDocker from "./geek-docker";
// 配置axios
import "./option/axiosConf";

// 当前可用的功能
const cliAll = [geekDocker];

// 清理控制台
console.clear();

// 欢迎
console.log(chalk.dim.bold.blue(
  figlet.textSync("Geek + Cli", { horizontalLayout: "default", verticalLayout: "default" })
), "\r\n", chalk.dim.bold.blue("mtshen v1.0"));

inquirer
    .prompt([
        {
            type: 'rawlist', // 还有input,checkbox,password等类型
            name: 'selCliType',
            message: '以下功能可用:',
            choices: cliAll.map(cliItem => ({
              name: cliItem.CLI_NAME,
              value: cliItem,
            }))
        },
    ])
    .then(answers => {
        // 通过answers拿到用户交互的结果,然后可以处理其他逻辑
        answers.selCliType.start();
        return answers.selCliType.CLI_NAME;
    });
