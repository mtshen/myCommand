// 1. 开启/关闭, 部署, 快速部署(保持原配置, 仅更新代码), 重启, 编辑, 移除
// 关闭, 移除 结束后, 回到主页
// 开启, 快速部署, 重启 后 进入监听页面, 直到完成操作
// 编辑 进入编辑界面, 完成后返回
// 部署 进入部署界面, 完成后返回
import * as chalk from "chalk";
import { prompt } from "inquirer";
import Menu from "../../../constants/Menu";
import { clearConsole } from "../../../console";
import { delInstanceId, getInstanceId, restartInstanceId, instanceDeployInfoApi, instanceDeployApi } from "../../api";

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
          { title: "快速部署(保持配置, 仅更新代码)", event: "updateDocker" },
          { title: "编辑当前Docker", },
          { title: "复制当前Docker", event: "copyDocker" },
          { title: "重启当前Docker", event: "restartDocker" },
          { title: "删除当前Docker", event: "removeDocker" },
        ];
      });
    }
  }

  // 显示当前Docker信息
  showDockerInfo() {
    const { id } = this.props;
    return getInstanceId(id).then((instanceData:any) => {
      return instanceDeployInfoApi(instanceData.project_id, instanceData.id).then((deployInfo: any) => {
        this.props.dockerInfo = instanceData;
        this.props.deployInfo = deployInfo;
        this.showThatDockerInfo();
      });
    })
  }

  showThatDockerInfo() {
    const { dockerInfo, deployInfo } = this.props;
    console.log(chalk.bold("项目名称: "), chalk.bold.blue(dockerInfo.instance_name), dockerInfo.is_deployed ? chalk.bold.green("【已部署】") : chalk.bold.red("【未部署】"));
    console.log(chalk.bold("环境标识: "), chalk.bold.blue(`${ dockerInfo.deploy_env === 1 ? "test" : "dev" }-${dockerInfo.id}`));
    console.log(chalk.bold("依赖项目: "), deployInfo.build_info.map(item => chalk.bold.blue(`${item.build_source}(${item.branch || '尚未部署'})`)).join(", "));
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
      restartInstanceId(id).then((data: any) => {
        console.log(chalk.dim.bold.green(`:) 指令已发送，请等待重启完成`));
        setTimeout(() => {
          // 回退
          this.lastMenu && this.lastMenu.__handle();
        }, 3000);
      })
      .catch((error) => {
        console.log(chalk.dim.bold.red(`:( 重启失败, 错误: [${error}]`));
        this.reRender()
      });
    } else {
      console.log(chalk.dim.bold.red(`:( 此Docker不存在, 3秒后回退到主页, ID: [${id}]`));
      setTimeout(() => {
        // 回退
        this.lastMenu && this.lastMenu.__handle();
      }, 3000);
    }
  }


  updateDocker() {
    const { deployInfo } = this.props;

    const notify_user_list = deployInfo.build_info.map(item => {
      return {
        ...item,
        branchFill: true, // 部署分支
        commitFill: false,  // 部署commit
        deploy_commit_id: "", // 部署commit ID
        deploy_branch: item.branch, // 部署 分支 Id
        liquibase_update: true, // 是否更新 liquibase
      };
    });

    const option = {
      change: "",
      describe: "",
      email_list: [],
      form_data: [],
      instance_id: deployInfo.instance.id,
      notify_user_list: notify_user_list,
      pipeline_id: 16,  // 构建, 部署
      rollback_mark: "",
      service_list: [],
      task_type: null,
    };

    instanceDeployApi(option).then((data) => {
      console.log(chalk.bold("构建依赖项目: "), deployInfo.build_info.map(item => chalk.bold.blue(`${item.build_source}(${item.branch || '尚未部署'})`)).join(", "));
      console.log(chalk.bold("是否更新liquibase: true"));
      console.log(chalk.bold("指令已下发, 请等待构建完成, 3秒后返回主菜单"));
      setTimeout(() => {
        this.lastMenu && this.lastMenu.__handle();
      }, 3000);
    })
    .catch((error) => {
      console.log(`构建失败【${error}】`);
      this.lastMenu && this.lastMenu.__handle();
    });
  }
}
