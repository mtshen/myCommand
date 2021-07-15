import { FundInfoListItemType } from "../type/fund";

// 在天天基金拿到的数据源内容如下
// [基金代码, 基金名称, 基金简称, 计算日期, 单位净值, 累计净值, 日增长率, 近一周, 近一个月, 近3个月, 近6个月, 近1年, 近3年, 今年来, 成立来, 成立时间]
export default class Fund {
  fundInfoList: FundInfoListItemType[];

  constructor(fundInfoList) {
    this.fundInfoList = fundInfoList.map(infoText => {
      const [
        code, // 001951
        name, // 金鹰改革红利混合
        nameCode, // JYGGHLHH
        currentDate, // 当前数据日期 2021-03-02
        companyNetWorth, // 单位净值 2.4990
        cumulativeNetWorth, // 累计净值 2.4990
        dayGrowthRate, // 日增长率 -2.08
        weekGrowthRate, // 近一周增长率 -6.54
        monthGrowthRate, // 近一个月增长率 -3.59
        seasonGrowthRate, // 近3个月增长率 40.79
        halfYearGrowthRate, // 近6个月增长率 64.84
        yearGrowthRate, // 近一年增长率 88.32
        year2GrowthRate, // 近2年增长率 152.68
        year3GrowthRate, // 近3年增长率 113.96
        thisYearGrowthRate, // 今年以来增长率 13.59
        yearGrowthRateAll, // 成立以来增长率 149.90
        creationTime //成立日期
      ] = infoText.split(",");

      return {
        code,
        name,
        nameCode,
        currentDate,
        companyNetWorth,
        cumulativeNetWorth,
        dayGrowthRate,
        weekGrowthRate,
        seasonGrowthRate,
        halfYearGrowthRate,
        yearGrowthRate,
        year3GrowthRate,
        thisYearGrowthRate,
        yearGrowthRateAll,
        creationTime,
        monthGrowthRate,
        year2GrowthRate,
      }
    });
  }

  // 移除N年内的新基金
  removalDateOf(year) {
    const { fundInfoList } = this;
    this.fundInfoList = fundInfoList.filter((item) => {
      return (+new Date()) - (31536000000 * year) > +new Date(item.creationTime);
    });
  }

  // 移除累计净值低于N的基金
  removalCumulativeNetWorthOf(cumulativeNetWorth) {
    const { fundInfoList } = this;
    this.fundInfoList = fundInfoList.filter((item) => {
      return Number(item.cumulativeNetWorth) > cumulativeNetWorth;
    });
  }

  // 对基金进行逐个排查, 每次仅排查一个基金
  filterSync(callback: Function) {
    return new Promise((resolve) => {
      const { fundInfoList } = this;
      const that = this;
      const filterFundList = [];
      let index = -1;

      function next(isPass) {
        isPass &&
          filterFundList.push(fundInfoList[index]);

        index += 1;
        const item = fundInfoList[index];
        if (item) {
          callback(item, next);
        } else {
          that.fundInfoList = filterFundList;
          resolve(filterFundList);
        }
      }

      next(false);
    });
  }
}
