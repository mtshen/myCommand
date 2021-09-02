import axios from "axios";

// 自动填充cookie
axios.defaults.withCredentials = true;
// 设置超时时间
axios.defaults.timeout = 10000;

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  const { code, data, msg } = response.data;
  if (Number(code) !== 200) {
    return Promise.reject(msg);
  } else {
    return data;
  }
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});
