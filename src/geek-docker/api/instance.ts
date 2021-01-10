import axios from "axios";
import { getOption } from "../../option/index";
import { GeekDockerOption } from "../../type/geek-docker";

// 查询列表
export function instance() {
  return new Promise((resolve, reject) => {
    getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
      const { serverUrl, userInfoCache } = paramsCache;
      axios.get(`http://${serverUrl}/api/v1/instance`, {
        headers: {'Authorization': userInfoCache.token },
        params: {
          id: "",
          page: 1,
          limit: 30,
          deploy_env: "",
          creator: userInfoCache.userName,
        },
      }).then(({ data }) => {
        resolve(data);
      }).catch((error) => {
        reject(error);
      });
    });
  });
}
