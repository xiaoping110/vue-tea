"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _mintUi = require("mint-ui");

var _index = _interopRequireDefault(require("../store/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var timeout = 50000;
var baseURL = "/";

var request = _axios["default"].create({
  timeout: timeout,
  baseURL: baseURL
}); // 处理Token


var addToken = function addToken(config) {
  var token = _index["default"].state.user.token;
  config.headers.Authorization = "Bearer ".concat(token);
  config.headers.token = token;
  config.headers.ContentType = "application/x-www-form-urlencoded";
  return config;
}; // 根据请求类型，处理请求数据


var appParams = function appParams(config) {
  var method = config.method.toLowerCase() === "post" ? "data" : "params";
  config[method] = _objectSpread({}, config[method]);
  return config;
}; // 请求拦截器


request.interceptors.request.use(function (config) {
  _mintUi.Indicator.open("加载中...");

  return Promise.resolve(config).then(appParams).then(addToken);
});

var checkNetStatus = function checkNetStatus(response) {
  var status = response.status,
      message = response.message,
      data = response.data;
  var errorCodes = [301, 401, 403, 404, 500, "ERR_BAD_RESPONSE"];

  if (errorCodes.includes(status) || errorCodes.includes(data.code)) {
    _mintUi.MessageBox.alert(message || data.message);
  }

  return response;
};

var checkCode = function checkCode(response) {
  // const { errorCode, code, message } = response.data;
  // const successCodes = [0, 200, 304];
  // if (!successCodes.includes(code) && !successCodes.includes(errorCode)) {
  //   MessageBox.alert(message);
  // }
  return response;
};

var initResData = function initResData(response) {
  var req = /(download|down)/gi;

  if (req.test(response.config.url) || response.request.responseType === "blob") {
    return response;
  }

  return response.data;
}; // 响应拦截器


request.interceptors.response.use(function (response) {
  _mintUi.Indicator.close();

  return Promise.resolve(response).then(checkNetStatus).then(checkCode).then(initResData);
});
var _default = request;
exports["default"] = _default;