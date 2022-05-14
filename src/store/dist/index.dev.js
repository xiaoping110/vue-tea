"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vuex = _interopRequireDefault(require("vuex"));

var _vuexPersistedstate = _interopRequireDefault(require("vuex-persistedstate"));

var _logger = _interopRequireDefault(require("vuex/dist/logger"));

var _user = _interopRequireDefault(require("./modules/user"));

var _cart = _interopRequireDefault(require("./modules/cart"));

var _path = _interopRequireDefault(require("./modules/path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_vue["default"].use(_vuex["default"]);

var _default = new _vuex["default"].Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: _user["default"],
    cart: _cart["default"],
    path: _path["default"]
  },
  plugins: [(0, _logger["default"])(), (0, _vuexPersistedstate["default"])({
    key: "$store"
  })]
});

exports["default"] = _default;