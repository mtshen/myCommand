import Menu from "../constants/Menu";
import { clearConsole } from "../console";
import * as cheerio from "cheerio";
import { getCompanyHtml, getEastmoneyDataRankhandler } from "./api";
import * as chalk from "chalk";
import Fund from "./Fund";

export default class GeekDocker extends Menu {
  title = "mtshen + 基金筛选";
  option = {
    // 基金公司TOP25
    managerList: [],
    // 现存所有基金股票数据
    eastMoneyDataList: [],
    // 基金模型
    fundModel: null,
  };

  constructor() {
    super();
  }

  created() {
    clearConsole();
    console.log(chalk.bold("正在拉取最新基金数据源, 数据来自<天天基金>"));
    console.log(chalk.bold.red("请勿频繁使用该工具, 容易被天天基金进行IP封锁"));
    console.log(chalk.bold.blue("拉取基金公司TOP25"));
    return getCompanyHtml().then((data) => {
      const $ = cheerio.load(data);
      const gspmTblList = $("#gspmTbl tbody tr");
      const manager = [];
      gspmTblList.each((index, item) => {
        manager.push($(item).find("td:eq(1)").text());
      });
      // 拿到基金公司TOP25数据
      manager.splice(25);
      this.option.managerList = manager;
      console.log(chalk.bold.green("拉取成功 ~"));
    })

    .then(() => {
      console.log(chalk.bold.blue("拉取目前可投全部基金数据集"));
      return getEastmoneyDataRankhandler();
    })

    // 拿到所有基金数据
    .then((data) => {
      this.option.eastMoneyDataList = data;
      console.log(chalk.bold.green(`拉取成功 ~ 共 ${data.length} 支基金`));
      console.log(chalk.bold.blue("开始建立我的基金模型"));
      const fundModel = new Fund(this.option.eastMoneyDataList);
      this.option.fundModel = fundModel;

      // 保留超过5年的老基
      fundModel.removalDateOf(5);
      console.log(chalk.bold.blue(`剔除无法参考的基金, 剩余${fundModel.fundInfoList.length}支`));

      // 剥离累计净值小于3.5的基金
      fundModel.removalCumulativeNetWorthOf(3.5);
      console.log(chalk.bold.blue(`剔除往年无高净值基金, 剩余${fundModel.fundInfoList.length}支`));
    });

  }
}
