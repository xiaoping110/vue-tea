"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Home = _interopRequireDefault(require("../views/Home.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var originalPush = _vueRouter["default"].prototype.push;

_vueRouter["default"].prototype.push = function push(location, resolve, reject) {
  if (resolve || reject) return originalPush.call(this, location, resolve, reject);
  return originalPush.call(this, location)["catch"](function () {});
};

_vue["default"].use(_vueRouter["default"]);

var routes = [{
  path: "/",
  redirect: "/home"
}, {
  path: "/home",
  name: "Home",
  component: _Home["default"]
}, {
  path: "/list",
  name: "List",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/List.vue"));
    });
  }
}, {
  path: "/cart",
  name: "Cart",
  meta: {
    login: true
  },
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Cart.vue"));
    });
  }
}, {
  path: "/my",
  name: "My",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/My.vue"));
    });
  }
}, {
  path: "/login",
  name: "Login",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Login/Login.vue"));
    });
  }
}, {
  path: "/userlogin",
  name: "UserLogin",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Login/UserLogin.vue"));
    });
  }
}, {
  path: "/register",
  name: "Register",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Login/Register.vue"));
    });
  }
}, {
  path: "/search",
  name: "Search",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Search.vue"));
    });
  },
  children: [{
    path: "/",
    name: "index",
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Search/Search-index.vue"));
      });
    }
  }, {
    path: "list",
    name: "SearchList",
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Search/Search-List.vue"));
      });
    }
  }]
}, {
  path: "/detail",
  name: "Detail",
  meta: {
    keepAlive: true
  },
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Detail.vue"));
    });
  }
}, {
  path: "/order",
  name: "Order",
  meta: {
    keepAlive: true
  },
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Order.vue"));
    });
  }
}, {
  path: "/path",
  name: "Path",
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Path.vue"));
    });
  },
  children: [{
    path: "/",
    name: "PathIndex",
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Path/Path-Index.vue"));
      });
    }
  }, {
    path: "/pathlist",
    name: "PathList",
    component: function component() {
      return Promise.resolve().then(function () {
        return _interopRequireWildcard(require("../views/Path/Path-List.vue"));
      });
    }
  }]
}, {
  path: "/payment",
  name: "Payment",
  meta: {
    login: true
  },
  component: function component() {
    return Promise.resolve().then(function () {
      return _interopRequireWildcard(require("../views/Payment"));
    });
  }
}];
var router = new _vueRouter["default"]({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
});
router.beforeEach(function (to, from, next) {
  var loginStatus = JSON.parse(localStorage.getItem("$store")).user.loginStatus;

  if (to.meta.login && !loginStatus) {
    next("/login?redirect=".concat(to.path));
  } else {
    if (loginStatus && to.path === "/login") {
      next("/my");
    }

    next();
  }
});
var _default = router;
exports["default"] = _default;