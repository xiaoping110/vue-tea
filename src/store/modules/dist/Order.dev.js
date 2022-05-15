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
  getters: {},
  mutations: _defineProperty({}, _mutationsTypes.INIT_ORDER, function (state, orderId) {
    state.list = orderId;
  }),
  actions: {}
};
exports["default"] = _default;