import Menu from "./constants/Menu";
import { clearConsole, exitConsole } from "./console";

// 内容
import GeekDocker from "./geek-docker";
import Fund from "./fund";
export default class TopLevelMenu extends Menu {
  title = "主菜单";
  menuList = [];

  constructor() {
    super();
    this.menuList = [
      new GeekDocker(),
      new Fund(),
      { title: "退出", event: "exitView" }
    ];
  }

  created() {
    clearConsole();
    // 顶级菜单取消 lastMenu
    this.lastMenu = null;
  }

  exitView() {
    exitConsole();
  }
}

