import Menu from "../constants/Menu";
import { clearConsole } from "../console";
import * as cheerio from "cheerio";
import { getCompanyHtml, getEastmoneyCodeHtml, getEastmoneyDataRankhandler } from "./api";
import * as chalk from "chalk";
import Fund from "./Fund";
import { FundInfoListItemType } from "../type/fund";
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
    console.log(chalk.bold.blue("拉取基金公司TOP80"));
    return getCompanyHtml().then((data) => {
      const $ = cheerio.load(data);
      const gspmTblList = $("#gspmTbl tbody tr");
      const manager = [];
      gspmTblList.each((index, item) => {
        manager.push($(item).find("td:eq(1)").text());
      });
      // 拿到基金公司TOP80数据
      manager.splice(80);
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

      // 保留超过3年的老基
      fundModel.removalDateOf(3);
      console.log(chalk.bold.blue(`剔除无法参考的基金, 剩余${fundModel.fundInfoList.length}支`));

      // 剥离累计净值小于3.5的基金
      fundModel.removalCumulativeNetWorthOf(3.5);
      console.log(chalk.bold.blue(`剔除往年无高净值基金, 剩余${fundModel.fundInfoList.length}支`));

      console.log(chalk.bold.blue(`开始对剩余基金进行二级分析...`));

      return fundModel.filterSync((fundItem, next: Function) => {
        console.log(chalk.bold.blue(`分析基金：${fundItem.name}（${fundItem.code}）`));
        getEastmoneyCodeHtml(fundItem.code).then((data) => {
          const $ = cheerio.load(data);
          // 对剩余基金进行详细数据分析
          // 1. 对基金往年业绩评分判断 每年业绩至少在4/1位
          // 2. 对基金规模进行判断 5 ~ 200 亿
          // 3. 基金公司分析是否在榜...等等

          // 由于没有做代理池, 每支基金分析结束延迟1s, 防止被IP封锁
          setTimeout(() => {
            next(true);
          }, 1000);
        });
      });
    })

    // 二级判断结束
    .then(() => {
      const { fundModel } = this.option;
      console.log(chalk.bold.green(`二级分析完成 ~ 剩余 ${fundModel.fundInfoList.length} 支基金`));
      fundModel.fundInfoList.forEach((item: FundInfoListItemType) => {
        console.log(item.code);
      });
    });

  }
}