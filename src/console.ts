
import * as chalk from "chalk";
import * as figlet from "figlet";

export function clearConsole() {
  // 清理控制台
  console.clear();

  // 欢迎
  console.log(chalk.dim.bold.blue(
    figlet.textSync("Geek + Cli", { horizontalLayout: "default", verticalLayout: "default" })
  ), "\r\n", chalk.dim.bold.blue("mtshen v1.0"));
}

export function exitConsole() {
  // 清理控制台
  console.clear();

  // 再见
  console.log(chalk.dim.bold.blue(
    figlet.textSync("  < bye />  ", { horizontalLayout: "default", verticalLayout: "default" })
  ));
}

