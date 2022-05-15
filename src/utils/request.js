import axios from "axios";
import { Indicator, MessageBox } from "mint-ui";
// import router from "../router/index";
import store from "../store/index";

const timeout = 50000;
const baseURL = "/";

const request = axios.create({
  timeout,
  baseURL,
});

// 处理Token
const addToken = (config) => {
  const token = store.state.user.token;
  config.headers.Authorization = `Bearer ${token}`;
  config.headers.token = token;
  config.headers.ContentType = "application/x-www-form-urlencoded";
  return config;
};

// 根据请求类型，处理请求数据
const appParams = (config) => {
  const method = config.method.toLowerCase() === "post" ? "data" : "params";
  config[method] = {
    ...config[method],
  };
  return config;
};

// 请求拦截器
request.interceptors.request.use((config) => {
  Indicator.open("加载中...");
  return Promise.resolve(config).then(appParams).then(addToken);
});

const checkNetStatus = (response) => {
  const { status, message, data } = response;
  const errorCodes = [301, 401, 403, 404, 500, "ERR_BAD_RESPONSE"];
  if (errorCodes.includes(status) || errorCodes.includes(data.code)) {
    MessageBox.alert(message || data.message);
  }
  return response;
};

const checkCode = (response) => {
  // const { errorCode, code, message } = response.data;
  // const successCodes = [0, 200, 304];
  // if (!successCodes.includes(code) && !successCodes.includes(errorCode)) {
  //   MessageBox.alert(message);
  // }
  return response;
};

const initResData = (response) => {
  const req = /(download|down)/gi;
  if (
    req.test(response.config.url) ||
    response.request.responseType === "blob"
  ) {
    return response;
  }
  return response.data;
};

// 响应拦截器
request.interceptors.response.use((response) => {
  Indicator.close();
  return Promise.resolve(response)
    .then(checkNetStatus)
    .then(checkCode)
    .then(initResData);
});

export default request;
