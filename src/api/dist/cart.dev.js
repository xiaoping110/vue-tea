"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.successPayment = exports.payMent = exports.submitOrder = exports.addOrder = exports.updateNum = exports.deleteCart = exports.getCartList = void 0;

var _request = _interopRequireDefault(require("@/utils/request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getCartList = function getCartList() {
  return (0, _request["default"])({
    url: "/api/selectCart",
    method: "post"
  });
};

exports.getCartList = getCartList;

var deleteCart = function deleteCart(arrId) {
  return (0, _request["default"])({
    url: "/api/deleteCart",
    method: "post",
    data: {
      arrId: arrId
    }
  });
};

exports.deleteCart = deleteCart;

var updateNum = function updateNum(id, num) {
  return (0, _request["default"])({
    url: "/api/updateNum",
    method: "post",
    data: {
      id: id,
      num: num
    }
  });
};

exports.updateNum = updateNum;

var addOrder = function addOrder(arr) {
  return (0, _request["default"])({
    url: "/api/addOrder",
    method: "post",
    data: {
      arr: arr
    }
  });
};

exports.addOrder = addOrder;

var submitOrder = function submitOrder(data) {
  return (0, _request["default"])({
    url: "/api/submitOrder",
    method: "post",
    data: data
  });
};

exports.submitOrder = submitOrder;

var payMent = function payMent(data) {
  return (0, _request["default"])({
    url: "/api/payMent",
    method: "post",
    data: {
      data: data
    }
  });
};

exports.payMent = payMent;

var successPayment = function successPayment(data) {
  return (0, _request["default"])({
    url: "/api/successPayment",
    method: "post",
    data: {
      data: data
    }
  });
};

exports.successPayment = successPayment;