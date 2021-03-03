import axios from "axios";

export function getCompanyHtml() {
  return axios.get(`http://fund.eastmoney.com/company/default.html`)
  .then(({ data }) => {
    return data;
  });
}


export function getEastmoneyCodeHtml(code) {
  return axios.get(`http://fund.eastmoney.com/${code}.html`)
    .then(({ data }) => {
      return data;
    });
}
