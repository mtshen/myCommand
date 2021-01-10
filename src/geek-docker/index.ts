import * as chalk from "chalk";
import * as inquirer from "inquirer";
import { GeekDockerOption } from "../type/geek-docker";
import { login, instance } from "./api";
import { getOption, setOption } from "./../option/index";
import dataStorage from "./data";

// 当前组件名称
export const CLI_NAME = "geek + Docker 2.0 自动部署";

export function start() {
  console.log("欢迎使用", chalk.dim.bold.blue(CLI_NAME));

  // 首先检查是否存在默认选项
  getOption("geek-docker").then((option: GeekDockerOption) => {
    const makePrompts = [];
    if (!option.serverUrl) {
      // IP未填写
      makePrompts.push({
        type: "input",
        name: 'serverUrl',
        message: 'Docker ops地址(域名或IP):',
        default: "devops.geekplus.cc",
        validate: (value) => {
          if (
            /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)(:\d{1,9})?$/.test(value) ||
            /^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/.test(value)
          ) {
            return true;
          }
          return "请输入正确的IP或域名, 如172.0.0.1 或 devops.geekplus.cc";
        },
      });
    }

    if (!option.loginParams.email || !option.loginParams.password) {
      // 用户名密码未填写
      makePrompts.push({
        type: "input",
        name: 'email',
        message: '用户名(邮箱):',
        validate: (value) => {
          return value ? true : "请填写用户名";
        },
      },{
        type: "input",
        name: 'password',
        message: '密码:',
        transformer(value) {
          return [...value].map(i => "*").join("")
        },
        // make: true,
        validate: (value) => {
          return value ? true : "请填写密码";
        },
      });
    }

    if (makePrompts.length) {
      console.log(chalk.dim.red("您还未添加过关键配置, 请先添加 ↓"));
      inquirer.prompt(makePrompts).then((answers) => {
        const newOption:GeekDockerOption = {
          serverUrl: answers.serverUrl,
          loginParams: {
            email: answers.email,
            password: answers.password
          }
        };

        setOption("geek-docker", newOption).then(() => {
          console.log(chalk.dim.green("初始化成功 ~ "));
          viewDockerCli();
        });
      });
    } else {
      viewDockerCli();
    }
  });
}

// 登录
function loginDocker() {
  return login().then(({ code, data }) => {
    if (code === 200) {
      console.log(chalk.dim.bold.blue(`[${data["j-user"].name}] 登录成功 ~ `));
      dataStorage.set("loginCache", data);
    }
  });
}

// 展示 Docker ops 2.0 可用功能
function viewDockerCli() {
  console.log(chalk.dim.bold.blue("准备登录 Docker Ops 2.0 系统"));

  // 先登录, 得到cookie, 然后展示可用的自动化操作
  loginDocker().then(() => {
    instance().then((data) => {
      console.log(data);
    });
  });
}



// inquirer
// .prompt([
//     {
//         type: 'list', // 还有input,checkbox,password等类型
//         name: 'selCliType',
//         message: '选择操作或Docker',
//         choices: [
//           // (重启, 快速部署, 部署其他)
//           // 新增Docker
//           { name: "新增Docker" },
//           // 管理Docker
//           { name: "管理Docker快速部署模板" },
//           // 我的Docker
//           { name: "dev-1100 模板0001" },
//         ]
//     },
// ])
// .then(answers => {
//     // 通过answers拿到用户交互的结果,然后可以处理其他逻辑
//     answers.selCliType.start();
//     return answers.selCliType.CLI_NAME;
// });
