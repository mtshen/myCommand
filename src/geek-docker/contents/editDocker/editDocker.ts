// 编辑Docker
import * as chalk from "chalk";
import { prompt } from "inquirer";
import Menu from "../../../constants/Menu";
import { clearConsole } from "../../../console";
import { delInstanceId, getInstanceId, restartInstanceId, instanceDeployInfoApi, instanceDeployApi } from "../../api";

export default class Docker extends Menu {
  menuList = [];

  constructor(props) {
    super();
    this.title = `编辑Docker`;
    this.props = { ...this.props, ...props }
  }

  created() {
    clearConsole();

    const { deployInfo } = this.props;
    const { build_info, instance } = deployInfo;
    const  prompts = build_info.map(menuItem => {
      return {
        name: menuItem.build_source,
        message: `${menuItem.build_source}(${menuItem.name}): `,
        default: menuItem.branch,
      };
    });

    prompt(prompts).then((option) => {
      console.log(option);
    })

  }
}
