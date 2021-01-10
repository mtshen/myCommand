import axios from "axios";
import { getOption } from "../../option";
import { GeekDockerOption } from "../../type/geek-docker";

export function login(params:any = {}) {
  return new Promise((resolve, reject) => {
    getOption("geek-docker").then((paramsCache: GeekDockerOption) => {
      const { serverUrl, loginParams } = paramsCache;
      axios.post(`http://${serverUrl}/api/v1/login`, {
        email: params.email || loginParams.email,
        password: params.password || loginParams.password,
      }).then((request) => {
        console.log(request);
        debugger;
        resolve(request.data);
      }).catch((error) => {
        reject(error);
      });
    });
  });
}
