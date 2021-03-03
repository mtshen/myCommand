/* 初始化各种配置 */

// 配置axios
import "./option/axiosConf";
// 配置inquirer
import "./option/inquirer";

/* 配置完成, 运行主菜单 */
import TopLevelMenu from "./main";

// 开始执行
new TopLevelMenu().__handle();
