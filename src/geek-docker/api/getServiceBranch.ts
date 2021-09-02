import axios from "axios";
import { getOption } from "../../option/index";
import { GeekDockerOption } from "../../type/geek-docker";

// 查询配置库  // 116: 测试环境, 347: 开发环境, 其他: 357, 仿真: 348  生产: 58
export function getInstanceId(configEnv: String) {
  return getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
    const { serverUrl, userInfoCache } = paramsCache;
    return axios.get(`http://${serverUrl}/api/v1/service/branch`, {
      headers: {'Authorization': userInfoCache.token },
      params: {
        config_env: configEnv || "116",
      },
    });
  })
}
