import axios from "axios";

// 自动填充cookie
axios.defaults.withCredentials = true;
// 设置超时时间
axios.defaults.timeout = 10000;
