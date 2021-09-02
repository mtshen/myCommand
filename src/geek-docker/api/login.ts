import axios from "axios";
import { getOption } from "../../option";
import { GeekDockerOption } from "../../type/geek-docker";
import dataStorage from "../data";

// 登录接口
export function loginApi(params:any = {}) {
  return getOption("geek-docker")

  .then((paramsCache: GeekDockerOption) => {
      const { serverUrl, loginParams } = paramsCache;
      return axios.post(`http://${serverUrl}/api/v1/login`, {
        email: params.email || loginParams.email,
        password: params.password || loginParams.password,
      });
    })
}

// 获取用户信息
export function getUserInfoApi(token?: String) {
  return getOption("geek-docker")

  .then((paramsCache: GeekDockerOption) => {
    const { serverUrl } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/user/info`, {
      headers: {'Authorization': token }
    });
  })

  .then((data) => {
    return { data, token };
  })
}


/**
 * 将自动登录封装, 如果检测到有token就尝试使用koken登录 如果登录失败 就转正常登录
 * getUserInfoApi 是用token 直接获取用户数据
 * loginApi 是登录接口, 用来拿到最新的登录token
 * @returns
 */
export async function autoGetUserInfo() {

  const params: GeekDockerOption = await getOption("geek-docker");

  // 如果token存在, 尝试直接用token去登录
  if (params.userInfoCache.token) {
    return getUserInfoApi(params.userInfoCache.token).then((data) => {
      return data;
    });
  }

  // 如果token不存在, 尝试用目前存在的用户密码去登录
  return loginApi().then((data: any) => {
    return getUserInfoApi(data.token);
  })
}



