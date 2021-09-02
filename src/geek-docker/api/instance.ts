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
}

// 查询指定ID
export function getInstanceId(id: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/instance/${id}`, {
      headers: {'Authorization': userInfoCache.token },
    });
  })
}

// 删除指定ID
export function delInstanceId(id: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.delete(`http://${serverUrl}/api/v1/instance/${id}`, {
      headers: {'Authorization': userInfoCache.token },
    });
  })
}

// 重启指定Docker
export function restartInstanceId(id: String, isReset: Boolean = false) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.post(`http://${serverUrl}/api/v1/instance/job/restart/${id}`,
    { id, isReset, restart: true },
    {
      headers: {'Authorization': userInfoCache.token },
    });
  })
}

// 部署指定Docker
export function instanceDeployApi(option) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.post(`http://${serverUrl}/api/v1/instance/deploy/${option.instance_id}`,
    option,
    {
      headers: {'Authorization': userInfoCache.token },
    });
  })
}

export function instanceDeployInfoApi(projectId: String, dockerId: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/instance/deploy-info/${projectId}/${dockerId}`, {
      headers: {'Authorization': userInfoCache.token },
    });
  })
}


