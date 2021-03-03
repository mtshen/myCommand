// 新增Docker
import Menu from "../../../constants/Menu";
import { clearConsole } from "../../../console";
export default class Docker extends Menu {
  menuList = [];

  constructor(props) {
    super();
    this.props = { ...this.props, ...props }
  }

  created() {
    clearConsole();

    this.showDockerInfo();
    // 获取常用配置
    this.menuList = [
      { title: "部署Docker" },
      { title: "快速部署Docker(保持配置, 仅更新代码)" },
      { title: "编辑Docker" },
      { title: "启动Docker" },
      { title: "关闭Docker" },
      { title: "重启Docker" },
    ];
  }

  // 显示当前Docker信息
  showDockerInfo() {}
}
