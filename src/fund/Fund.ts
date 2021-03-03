import * as moment from "moment";
import { FundInfoListItemType } from "../type/fund";

// 在天天基金拿到的数据源内容如下
// [基金代码, 基金名称, 基金简称, 单位净值, 累计净值, 日增长率, 近一周, 近一个月, 近3个月, 近6个月, 近1年, 近3年, 今年来, 成立来, 成立时间]
export default class Fund {
  fundInfoList: FundInfoListItemType[];

  constructor(fundInfoList) {
    this.fundInfoList = fundInfoList.map(infoText => {
      const [
        code,
        name,
        nameCode,
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
        creationTime
      ] = infoText.split(",");

      return {
        code,
        name,
        nameCode,
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
        creationTime
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

  removalCumulativeNetWorthOf(cumulativeNetWorth) {
    const { fundInfoList } = this;
    this.fundInfoList = fundInfoList.filter((item) => {
      return Number(item.cumulativeNetWorth) > cumulativeNetWorth;
    });
  }
}
