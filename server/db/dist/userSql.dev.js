"use strict";

var User = {
  queryUserTel: function queryUserTel(option) {
    return "select * from user where tel=".concat(option.userTel);
  },
  queryUserPwd: function queryUserPwd(option) {
    return "select * from user where (tel=".concat(option.userTel, ") and (pwd=").concat(option.userPwd, ")");
  },
  insertData: function insertData(option) {
    var jwt = require("jsonwebtoken");

    var payload = {
      tel: option.userTel
    };
    var secret = "tbs";
    var token = jwt.sign(payload, secret, {
      expiresIn: 60
    });
    return "insert into user (tel,pwd,imgUrl,nickName,token) values (".concat(option.userTel, ",\"666666\",\"/images/user.jpeg\",").concat(option.userTel, ",\"").concat(token, "\")");
  },
  registerData: function registerData(option) {
    return "insert into user (tel,pwd,imgUrl,nickName,token) values (".concat(option.userTel, ",").concat(option.userPwd, ",\"580.jpeg\",\"1\",\"1\")");
  }
};
exports = module.exports = User;