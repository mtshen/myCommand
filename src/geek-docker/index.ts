import Menu from "../constants/Menu";
import { clearConsole } from "../console";
import { GeekDockerOption, GeekDockerUserInfoOption } from "../type/geek-docker";
import { autoGetUserInfo, getInstanceList } from "./api";
import { getOption, setOption } from "./../option/index";
import Docker from "./contents/docker/docker";

import * as chalk from "chalk";
import * as inquirer from "inquirer";

export default class GeekDocker extends Menu {
  title = "geek + Docker 2.0 系统";
  option = {
    dockerLoginInfo: null,
    dockerList: [],
  };

  constructor() {
    super();
  }

  created() {
    clearConsole();

    return this.checkGeekDockerConfig()
      .then(() => {
        // 先登录, 得到cookie, 然后展示可用的自动化操作
        return this.loginDocker();
      })

      // 然后拿到需要的数据列表
      .then(() => {
        const { dockerLoginInfo } = this.option;
        if (dockerLoginInfo) {
          return this.getInstance();
        } else {
          this.menuList = [
            { title: "重新登录", event: "resetLogin" },
          ];
          return Promise.reject()
        }
      })

      // 拼接数据列表
      .then(({ data }) => {
        const { pageData } = data;
        const dockerList = pageData.map((pageDataItem) => {
          const { id, instance_name, product_line_name, updated, deploy_env } = pageDataItem;
          return {
            id, // id
            updated, // 更新日期, 最早的排最上
            deployEnv: deploy_env, // 0: 开发环境, 1: 测试环境, 2: 其他环境, 3: 仿真环境, 4: 生成环境
            instanceName: instance_name,
            productLineName: product_line_name,
          }
        });

        this.option.dockerList = dockerList;

        this.menuList = [
          { title: "快速部署新的 Docker 环境", event: "autoDeployment" },
          { title: "建立快速部署模板", event: "createAutoDeploymentTemp" },
          ...dockerList.map(dockerItem => new Docker(dockerItem))
        ];
      })
  }

  checkGeekDockerConfig() {
    // 首先检查是否存在默认选项
    return getOption("geek-docker").then((option: GeekDockerOption) => {
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
        return inquirer.prompt(makePrompts);
      }
    })
    .then(answers => {
      if (answers) {
        const { serverUrl, email, password } = answers;
        const newOption: GeekDockerOption = {};
        serverUrl && (newOption.serverUrl = serverUrl);
        email && (newOption.loginParams = { email, password });
        return setOption("geek-docker", newOption);
      }
    })
    .then(() => {
      console.log(chalk.dim.green("正在自动登录到Docker 2.0系统, 请稍后..."));
    });
  }

  // 登录Docker 2.0, 如果成功则加入缓存区
  loginDocker() {
    return autoGetUserInfo().then(({ code, data, token }) => {
      if (code === 200) {
        if (data.isGetUserInfo) {
          console.log(chalk.dim.bold.blue(`[${data.user_name}] 欢迎回来 ~`));
        } else {
          console.log(chalk.dim.bold.blue(`[${data.user_name}] 登录成功 ~ `));
        }
        this.saveUserInfo(data, token);
      }
    }).catch(() => {
      this.option.dockerLoginInfo = null;
      console.log(chalk.dim.bold.red(`登录失败 ~ 请重试`));
    });
  }

  // 菜单, 重新登录
  resetLogin() {
    this.reRender()

  }

  getInstance() {
    return getInstanceList();
  }

  saveUserInfo(data, token) {
    const userInfoCache: GeekDockerUserInfoOption = {
      "userName": data.user_name,
      "userId": data.user_id,
      "token": token,
    };
    setOption("geek-docker", { userInfoCache });
    this.option.dockerLoginInfo = userInfoCache;
  }

  autoDeployment() {
    console.log("自动部署");
  }

  createAutoDeploymentTemp() {
    console.log("创建自动部署模板");
  }

  selectDocker() {
    console.log("选择Docker");
  }
}
