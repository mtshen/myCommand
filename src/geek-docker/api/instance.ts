import axios from "axios";
import { getOption } from "../../option/index";
import { GeekDockerOption } from "../../type/geek-docker";
import dataStorage from "../data";

// 查询列表
export function instance() {
  const loginCache = dataStorage.get("loginCache");
  return new Promise((resolve, reject) => {
    getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
      const { serverUrl } = paramsCache;
      axios.get(`http://${serverUrl}/api/v1/instance?page=1&limit=30&&id=&deploy_env=&creator=`, {
        headers: {'Authorization': loginCache.token }
      }).then(({ data }) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  });
}
