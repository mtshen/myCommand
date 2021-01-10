import axios from "axios";
import { getOption } from "../../option";
import { GeekDockerOption } from "../../type/geek-docker";
import dataStorage from "../data";

// 登录接口
export function login(params:any = {}) {
  return getOption("geek-docker")

  .then((paramsCache: GeekDockerOption) => {
      const { serverUrl, loginParams } = paramsCache;
      return axios.post(`http://${serverUrl}/api/v1/login`, {
        email: params.email || loginParams.email,
        password: params.password || loginParams.password,
      });
    })

    .then((request) => {
      return request.data;
    });
}

// 获取用户信息
export function getUserInfo(token?: String) {
  return getOption("geek-docker")

  .then((paramsCache: GeekDockerOption) => {
    const { serverUrl } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/user/info`, {
      headers: {'Authorization': token }
    });
  })

  .then((request) => {
    const { code, data } = request.data;
    return { code, data, token};
  })
}


// 自动获取用户信息
export function autoGetUserInfo() {
  let isGetUserInfo = false;
  let paramsCache: GeekDockerOption;

  return getOption("geek-docker")

  .then((params: GeekDockerOption) => {
    paramsCache = params;

    // 有Token 并未失效 直接取用户信息
    if (params.userInfoCache.token) {
      return getUserInfo(params.userInfoCache.token).then((data) => {
        if (data.code === 200) {
          isGetUserInfo = true;
          return data;
        }

        // 无ToKen, 或失效 转登录
        return;
      });
    }
    // 无ToKen 转登录
    return;
  })

  // 登录
  .then((userInfo) => {
    // 不是真正的登录 才走登录
    if (!isGetUserInfo) {
      return login().then(loginInfo => {
        return getUserInfo(loginInfo.data.token);
      })
    }
    return userInfo;
  });
}



