"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mutationsTypes = require("../mutations-types");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = {
  state: {
    list: []
  },
  getters: {
    defaultPath: function defaultPath(state) {
      return state.list.filter(function (v) {
        return v.isDefault === "1";
      });
    }
  },
  mutations: _defineProperty({}, _mutationsTypes.INIT_DATA, function (state, arrPath) {
    state.list = arrPath;
  }),
  actions: {}
};
exports["default"] = _default;