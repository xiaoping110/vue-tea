"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mutationsTypes = require("../mutations-types");

var _mutations;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  state: {
    loginStatus: false,
    token: null,
    userInfo: {}
  },
  getters: {},
  mutations: (_mutations = {}, _defineProperty(_mutations, _mutationsTypes.USER_LOGIN, function (state, user) {
    state.loginStatus = true;
    state.token = user.token;
    state.userInfo = user;
  }), _defineProperty(_mutations, _mutationsTypes.USER_LOGOUT, function (state) {
    state.loginStatus = false;
    state.token = "";
    state.userInfo = {};
  }), _mutations),
  actions: {}
};
exports["default"] = _default;