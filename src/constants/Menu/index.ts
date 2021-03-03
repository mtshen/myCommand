
import { prompt } from "inquirer";

export default class Menu {
  // 名称
  title: String = "";
  // 当菜单作为子菜单时的名称
  menuTitle: String = "";
  // 上级菜单传入的数据
  props: any = {};
  // 存储当前菜单数据, 会自动传入到下级菜单中
  option: Object = {};
  // 上级菜单必定是Menu类型
  lastMenu: Menu|null = null;
  // 菜单数据
  menuList: Array<any> = [];
  menuType: String = "list";

  constructor() {}

  /**
   * 开始此菜单, 内部使用
   * @param menuList 菜单数据
   * @param lastMenu 上级菜单, 如果存在上级菜单, 渲染菜单时, 必定存在返回
   */
  __handle(lastMenu?: Menu, props?: Object) {
    return new Promise(resolve => {
      if (props) this.props = { ...this.props, ...props };
      if (lastMenu) this.lastMenu = lastMenu;
      resolve(void 0);
    })

    // 初始化菜单列表之前先执行 created
    // 这里可以对数据或者其他功能进行操作
    .then(() => {
      return this.created();
    })
    // 然后开始渲染菜单数据
    .then(() => {
      return this.render(this.menuList, this.lastMenu);
    })
    // 渲染完成后调用函数mounted
    .then(() => {
      return this.mounted();
    })
  }

  created() {}
  mounted() {}

  // 默认的渲染函数
  render(menuList, lastMenu) {
    const { menuType } = this;

    const choices = [];
    choices.push(
      // 菜单
      ...menuList.map(menuItem => {
        const { title, menuTitle } = menuItem;
        // default
        return {
          name: menuTitle || title,
          value: menuItem
        };
      }),
    );

    // 返回上级菜单
    lastMenu && choices.push({
      name: `返回到${ lastMenu.menuTitle || lastMenu.title }`,
      value: lastMenu,
    });

    return prompt([
      {
        type: menuType,
        name: 'selectMenuItem',
        message: '请选择:',
        choices,
      },
    ]).then(({ selectMenuItem }) => {
      // 如果是菜单数据, 则自动触发菜单切换事件
      if (selectMenuItem instanceof Menu) {
        selectMenuItem.__handle(this, this.option);
      } else {
        // 如果是普通事件, 自动触发
        const { event } = selectMenuItem;
        if (event && this[event]) {
          this[event](selectMenuItem);
        }
      }
    });
  }

  // 重新渲染组件
  reRender() {
    this.__handle();
  }
}
