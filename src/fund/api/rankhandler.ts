import axios from "axios";
import parseRankData from "./parseRankData.js";

export function getEastmoneyDataRankhandler() {
  return axios.get(`http://fund.eastmoney.com/data/rankhandler.aspx`, {
    params: {
      op: "ph",
      dt: "kf",
      ft: "all",
      rs: "",
      gs: 0,
      sc: "6yzf",
      st: "desc",
      sd: "2020-03-02",
      ed: "2021-03-02",
      qdii: "",
      tabSubtype: ",,,,,",
      pi: "1",
      pn: "10000",
      dx: "1",
      v: Math.random(),
    },
    headers: {
      cookie: "qgqp_b_id=79c55d8a5f7ccc67a5747dd64ce8cd94; st_si=66503244129862; st_asi=delete; ASP.NET_SessionId=pyecf2rmsnstbrengyibjtai; EMFUND2=null; EMFUND1=null; EMFUND3=null; EMFUND4=null; EMFUND5=null; EMFUND6=null; EMFUND7=null; EMFUND0=null; EMFUND8=03-02%2010%3A24%3A15@%23%24%u4FE1%u8BDA%u4E2D%u8BC1800%u533B%u836F%u6307%u6570%28LOF%29@%23%24165519; _adsame_fullscreen_18503=1; EMFUND9=03-02 13:24:54@#$%u91D1%u9E70%u6539%u9769%u7EA2%u5229%u6DF7%u5408@%23%24001951; st_pvi=2744858452918; st_sp=2021-03-01%2014%3A52%3A56; st_inirUrl=https%3A%2F%2Fwww.baidu.com%2Flink; st_sn=32; st_psi=2021030213284032-0-8836774833",
      Referer: "http://fund.eastmoney.com/data/fundranking.html",
    }
  })
  .then(({ data }) => {
    return parseRankData(data);
  });
}
