// 1. 开启/关闭, 部署, 快速部署(保持原配置, 仅更新代码), 重启, 编辑, 移除
// 关闭, 移除 结束后, 回到主页
// 开启, 快速部署, 重启 后 进入监听页面, 直到完成操作
// 编辑 进入编辑界面, 完成后返回
// 部署 进入部署界面, 完成后返回
import * as chalk from "chalk";
import { prompt } from "inquirer";
import Menu from "../../../constants/Menu";
import { clearConsole } from "../../../console";
import { delInstanceId, getInstanceId } from "../../api";

export default class Docker extends Menu {
  menuList = [];

  constructor(props) {
    super();
    const { id, deployEnv, instanceName, productLineName } = props;
    this.title = `[${productLineName}][${ deployEnv === 1 ? "test" : "dev" }-${id}] ${instanceName}`;
    this.props = { ...this.props, ...props }
  }

  created() {
    clearConsole();

    const { id } = this.props;

    if (!id) {
      console.log(":-( 此Docker不存在, 3秒后回退到主页, ID:", id);
      setTimeout(() => {
        // 回退
        this.lastMenu && this.lastMenu.__handle();
      }, 3000);
    } else {
      return this.showDockerInfo().then(() => {
        // 获取常用配置
        this.menuList = [
          { title: "部署Docker" },
          { title: "快速部署Docker(保持配置, 仅更新代码)" },
          { title: "编辑Docker" },
          { title: "启动Docker" },
          { title: "关闭Docker" },
          { title: "重启Docker", event: "restartDocker" },
          { title: "删除Docker", event: "removeDocker" },
        ];
      });
    }
  }

  // 删除Docker
  removeDocker() {
    const id = this.props.id;
    if (id) {
      const prompts = [{
        type: "confirm",
        message: "此操作将永久删除该Docker, 是否继续?",
        name: "isRemove",
      }];

      return prompt(prompts).then(({ isRemove }) => {
        if (isRemove) {
          return delInstanceId(id);
        }
        return Promise.reject();
      })
      .then(() => {
        console.log("删除成功！");
        setTimeout(() => {
          // 回退
          this.lastMenu && this.lastMenu.__handle();
        }, 2000);
      })
      .catch(() => {
        console.log("删除失败！");
        setTimeout(() => {
          // 回退
          this.lastMenu && this.lastMenu.__handle();
        }, 2000);
      });
    } else {
      console.log(":-( 此Docker不存在, 3秒后回退到主页, ID:", id);
      setTimeout(() => {
        // 回退
        this.lastMenu && this.lastMenu.__handle();
      }, 3000);
    }
  }

  // 重启Docker
  restartDocker() {
    const id = this.props.id;
    if (id) {
      const prompts = [{
        type: "confirm",
        message: "此操作将永久删除该Docker, 是否继续?",
        name: "isRemove",
      }];

      return prompt(prompts).then(({ isRemove }) => {
        if (isRemove) {
          return delInstanceId(id);
        }
        return Promise.reject();
      })
      .then(() => {
        console.log("删除成功！");
        setTimeout(() => {
          // 回退
          this.lastMenu && this.lastMenu.__handle();
        }, 2000);
      })
      .catch(() => {
        console.log("删除失败！");
        setTimeout(() => {
          // 回退
          this.lastMenu && this.lastMenu.__handle();
        }, 2000);
      });
    } else {
      console.log(":-( 此Docker不存在, 3秒后回退到主页, ID:", id);
      setTimeout(() => {
        // 回退
        this.lastMenu && this.lastMenu.__handle();
      }, 3000);
    }
  }

  // 显示当前Docker信息
  showDockerInfo() {
    const { id } = this.props;
    return getInstanceId(id).then(({ data, code }) => {
      console.log(chalk.bold("项目名称: "), chalk.bold.blue(data.instance_name));
      console.log(chalk.bold("环境标识: "), chalk.bold.blue(`${ data.deploy_env === 1 ? "test" : "dev" }-${data.id}`));
      console.log(data.is_deployed ? chalk.bold.green("已部署") : chalk.bold.red("未部署"));
      this.props.dockerInfo = data;
    })
  }
}
