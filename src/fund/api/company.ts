import axios from "axios";

export function getCompanyHtml() {
  return axios.get(`http://fund.eastmoney.com/company/default.html`)
  .then(({ data }) => {
    return data;
  });
}
