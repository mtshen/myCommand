import Menu from "./constants/Menu";
import { clearConsole, exitConsole } from "./console";

// 内容
import geekDocker from "./geek-docker";

class TopLevelMenu extends Menu {
  title = "主菜单";
  menuList = [];

  constructor() {
    super();
    this.menuList = [
      geekDocker,
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

export default new TopLevelMenu();
