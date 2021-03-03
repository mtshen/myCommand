import axios from "axios";
import { getOption } from "../../option/index";
import { GeekDockerOption } from "../../type/geek-docker";

// 查询列表
export function getInstanceList() {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/instance`, {
      headers: {'Authorization': userInfoCache.token },
      params: {
        id: "",
        page: 1,
        limit: 30,
        deploy_env: "",
        creator: userInfoCache.userName,
      },
    });
  })
  .then(({ data }) => {
    return data;
  });
}

// 查询指定ID
export function getInstanceId(id: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/instance/${id}`, {
      headers: {'Authorization': userInfoCache.token },
    });
  })
  .then(({ data }) => {
    return data;
  });
}

// 删除指定ID
export function delInstanceId(id: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.delete(`http://${serverUrl}/api/v1/instance/${id}`, {
      headers: {'Authorization': userInfoCache.token },
    });
  })
  .then(({ data }) => {
    return data;
  });
}

// 重启指定Docker
export function restartInstanceId(id: String, isReset: Boolean = false) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.post(`http://${serverUrl}/api/v1/instance/job/restart/${id}`,
    { id, isReset },
    {
      headers: {'Authorization': userInfoCache.token },
    });
  })
  .then(({ data }) => {
    return data;
  });
}



