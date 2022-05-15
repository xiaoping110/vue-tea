"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require("express");

var router = express.Router();

var connection = require("../db/sql.js");

var user = require("../db/userSql");

var jwt = require("jsonwebtoken");

var qs = require("qs");

var alipaySdk = require("../db/alipay.js");

var AlipayFormData = require("alipay-sdk/lib/form")["default"];

var axios = require("axios");

function getTimeToken(exp) {
  var getTime = parseInt(new Date().getTime() / 1000);

  if (getTime - exp > 60) {
    return true;
  }
}
/* GET home page. */


router.get("/", function (req, res) {
  res.send({
    code: 0,
    test: "哈哈"
  });
});
router.post("/api/successPayment", function (req, res) {
  var data = qs.parse(req.body.data);
  var out_trade_no = data.out_trade_no;
  var trade_no = data.trade_no;
  var formData = new AlipayFormData();
  formData.setMethod("get");
  formData.addField("bizContent", {
    out_trade_no: out_trade_no,
    trade_no: trade_no
  });
  var result = alipaySdk.exec("alipay.trade.query", {}, {
    formData: formData
  });
  result.then(function (resData) {
    axios({
      method: "GET",
      url: resData
    }).then(function (data) {
      /**
        data: {
            alipay_trade_query_response: {
              code: '10000',
              msg: 'Success',
              buyer_logon_id: 'ujv***@sandbox.com',
              buyer_pay_amount: '0.00',
              buyer_user_id: '2088622958745745',
              buyer_user_type: 'PRIVATE',
              invoice_amount: '0.00',
              out_trade_no: '20220515112302620654',
              point_amount: '0.00',
              receipt_amount: '0.00',
              send_pay_date: '2022-05-15 11:22:18',
              total_amount: '58.00',
              trade_no: '2022051522001445740505657553',
              trade_status: 'TRADE_SUCCESS'
            },
            sign: 'PbX4i6ooQ17dPj9Bsn196iC0TpFsgDhPbj6ELgotU/9a3sGg7aG0qQ2brKezsV6GHzf63pWI0Ds7YwZLtN1+kFPJa5Or8sERwMI2LqTUjlfF06BRn8kTn3wZvUqaT6Uq6YwxpvbAchTdh+acEZ78sMQquP2wSIXnC3ZaMB6gZsnvVjh1FJd2GavlNUzFB/GvXEDpFk6HuzEUNK42GN1EMvbnSm43kElT2RKgxiZjBvSvuiT0fBx6ESERFzcLZkD0wXpHUCTFBaNsDtKfrTq/SqA1AL9IBofyWZxmXq5Qz1Rj2F3zPJeA4ujGMu27sUkUudkvMqBnB5UemyauYs6f6g=='
          }
        }
      */
      var responseCode = data.data.alipay_trade_query_response;

      if (responseCode.code === "10000") {
        switch (responseCode.trade_status) {
          case "WAIT_BUYER_PAY":
            res.send({
              code: 0,
              success: true,
              message: "未付款！！！",
              data: {
                code: 0
              }
            });
            break;

          case "TRADE_SUCCESS":
            connection.query("update  store_order set order_status=\"3\" where order_id=".concat(responseCode.out_trade_no), function (error) {
              if (error !== null) {
                res.send({
                  code: 500,
                  success: false,
                  message: "支付成功,出单失败！！！"
                });
              } else {
                res.send({
                  code: 0,
                  success: true,
                  message: "支付成功！！！",
                  data: {
                    code: 2
                  }
                });
              }
            });
            break;

          default:
            res.send({
              code: 0,
              success: true,
              message: "支付失败！！！",
              data: {
                code: 2
              }
            });
        }
      } else if (responseCode.code === "40004") {
        res.send({
          code: 0,
          success: true,
          message: "交易不存在！！！"
        });
      }
    })["catch"](function () {
      res.send({
        code: 500,
        success: false,
        message: "交易失败！！！"
      });
    });
  });
});
router.post("/api/payMent", function (req, res) {
  var data = qs.parse(req.body.data);
  var orderId = data.orderId,
      name = data.name,
      price = data.price;
  var formData = new AlipayFormData();
  formData.setMethod("get");
  formData.addField("bizContent", {
    outTradeNo: orderId,
    productCode: "FAST_INSTANT_TRADE_PAY",
    totalAmount: price,
    subject: name
  });
  formData.addField("returnUrl", "http://localhost:8088/payment");
  var result = alipaySdk.exec("alipay.trade.page.pay", {}, {
    formData: formData
  });
  result.then(function (resp) {
    res.send({
      code: 0,
      success: true,
      message: "支付中...",
      data: {
        paymentUrl: resp
      }
    });
  });
});
router.post("/api/submitOrder", function (req, res) {
  var order_id = req.body.order_id;
  var selectList = req.body.selectList;
  connection.query("update  store_order set order_status=\"2\" where order_id=".concat(order_id), function (error) {
    if (error !== null) {
      res.send({
        code: 500,
        success: false,
        message: "订单提交失败！！！"
      });
    } else {
      selectList.forEach(function (item, index) {
        connection.query("delete from goods_cart where id=".concat(item), function (error) {
          if (error !== null) {
            res.send({
              code: 500,
              success: false,
              message: "购物车内容删除失败！！！"
            });
          } else {
            if (index === selectList.length - 1) {
              res.send({
                code: 0,
                success: true,
                message: "订单提交成功！！！"
              });
            }
          }
        });
      });
    }
  });
});
router.post("/api/addOrder", function (req, res) {
  var token = req.headers.token;
  var tokenObj = jwt.decode(token);
  var goodsArr = req.body.arr;

  function setTimeNewDateFmt(s) {
    return s < 10 ? "0" + s : s;
  }

  function randomNumber() {
    var now = new Date();
    var month = setTimeNewDateFmt(now.getMonth() + 1);
    var day = setTimeNewDateFmt(now.getDate());
    var hour = setTimeNewDateFmt(now.getHours());
    var minutes = setTimeNewDateFmt(now.getMinutes());
    var seconds = setTimeNewDateFmt(now.getSeconds());
    var orderCode = now.getFullYear().toString() + month + day + hour + minutes + seconds + Math.round(Math.random() * 1000000).toString();
    return orderCode;
  }

  var orderId = randomNumber();
  var goodsName = [];
  var goodsPrice = [];
  var goodsNum = []; // goodsArr.forEach((v) => {
  //   goodsName.push(v.goods_name);
  //   goodsPrice += v.goods_price * v.goods_num;
  //   goodsNum += Number(v.goods_num);
  // });

  goodsArr.forEach(function (v) {
    goodsName.push(v.goods_name);
    goodsPrice.push(v.goods_price * v.goods_num);
    goodsNum.push(v.goods_num);
  });
  connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
    var uId = result[0].id; // connection.query(
    //   `insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values(${uId},"${orderId}","${goodsName}","${goodsPrice}","${goodsNum}","1")`,
    //   (error1, result2) => {
    //     res.send({
    //       code: 0,
    //       success: true,
    //       message: "订单添加成功！！！",
    //       data: [orderId],
    //     });
    //   }
    // );

    goodsArr.forEach(function (v, index) {
      connection.query("insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values(".concat(uId, ",\"").concat(orderId, "\",\"").concat(v.goods_name, "\",\"").concat(v.goods_price * v.goods_num, "\",\"").concat(v.goods_num, "\",\"1\")"), function (error1) {
        if (error1 !== null) {
          res.send({
            code: 500,
            success: true,
            message: "订单添加失败！！！",
            data: [orderId]
          });
        } else {
          if (index === goodsArr.length - 1) {
            res.send({
              code: 0,
              success: true,
              message: "订单添加成功！！！",
              data: [orderId]
            });
          }
        }
      });
    });
  });
});
router.get("/api/deleteAddress", function (req, res) {
  var id = req.query.id;
  connection.query("delete from address where id=".concat(id), function (error) {
    if (error !== null) {
      res.send({
        code: 500,
        success: false,
        message: "地址删除失败！！！"
      });
    } else {
      res.send({
        code: 0,
        success: true,
        message: "地址删除成功！！！"
      });
    }
  });
});
router.post("/api/updateAddress", function (req, res) {
  var token = req.headers.token;
  var tokenObj = jwt.decode(token);
  var body = req.body;
  var _ref = [body.id, body.name, body.tel, body.province, body.city, body.county, body.addressDetail, body.isDefault, body.areaCode],
      id = _ref[0],
      name = _ref[1],
      tel = _ref[2],
      province = _ref[3],
      city = _ref[4],
      county = _ref[5],
      addressDetail = _ref[6],
      isDefault = _ref[7],
      areaCode = _ref[8];
  connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
    var uId = result[0].id;

    if (isDefault !== 1) {
      connection.query("update address set name=\"".concat(name, "\",tel=\"").concat(tel, "\",province=\"").concat(province, "\",city=\"").concat(city, "\",county=\"").concat(county, "\",addressDetail=\"").concat(addressDetail, "\",isDefault=\"").concat(isDefault, "\",areaCode=\"").concat(areaCode, "\" where id=").concat(id, " "), function (error1) {
        if (error1 !== null) {
          res.send({
            code: 500,
            success: false,
            message: "修改地址失败！！！"
          });
        } else {
          res.send({
            code: 0,
            success: true,
            message: "修改成功！！！"
          });
        }
      });
    } else {
      connection.query("select * from address where uId=".concat(uId, " and isDefault=\"1\""), function (error6, result6) {
        var addressId = result6[0].id;
        connection.query("update address set isDefault=replace(isDefault,\"1\",\"0\") where id=".concat(addressId), function () {
          connection.query("update address set name=\"".concat(name, "\",tel=\"").concat(tel, "\",province=\"").concat(province, "\",city=\"").concat(city, "\",county=\"").concat(county, "\",addressDetail=\"").concat(addressDetail, "\",isDefault=\"").concat(isDefault, "\",areaCode=\"").concat(areaCode, "\" where id=").concat(id, " "), function () {
            if (error !== null) {
              res.send({
                code: 500,
                success: false,
                message: "修改地址失败！！！"
              });
            } else {
              res.send({
                code: 0,
                success: true,
                message: "修改成功！！！"
              });
            }
          });
        });
      });
    }
  });
});
router.post("/api/selectAddress", function (req, res) {
  var token = req.headers.token;
  var tokenObj = jwt.decode(token);
  connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
    var uId = result[0].id;
    connection.query("select * from address where uId=".concat(uId), function (error1, result1) {
      res.send({
        code: 0,
        success: true,
        message: "查询成功",
        data: result1
      });
    });
  });
});
router.post("/api/insertAddress", function (req, res) {
  var token = req.headers.token;
  var tokenObj = jwt.decode(token);
  var body = req.body;
  var _ref2 = [body.name, body.tel, body.province, body.city, body.county, body.addressDetail, body.isDefault, body.areaCode],
      name = _ref2[0],
      tel = _ref2[1],
      province = _ref2[2],
      city = _ref2[3],
      county = _ref2[4],
      addressDetail = _ref2[5],
      isDefault = _ref2[6],
      areaCode = _ref2[7];
  connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
    var uId = result[0].id;

    if (isDefault !== 1) {
      connection.query("insert into address (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values (\"".concat(uId, "\",\"").concat(name, "\", \"").concat(tel, "\", \"").concat(province, "\", \"").concat(city, "\", \"").concat(county, "\", \"").concat(addressDetail, "\", \"").concat(isDefault, "\",\"").concat(areaCode, "\")"), function () {
        res.send({
          code: 0,
          success: true,
          message: "地址添加成功！！！"
        });
      });
    } else {
      connection.query("select * from address where uId=".concat(uId, " and isDefault=\"1\""), function (error2, result2) {
        var addressId = result2[0].id;
        connection.query("update address set isDefault=replace(isDefault,\"1\",\"0\") where id=".concat(addressId), function () {
          connection.query("insert into address (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values (\"".concat(uId, "\",\"").concat(name, "\", \"").concat(tel, "\", \"").concat(province, "\", \"").concat(city, "\", \"").concat(county, "\", \"").concat(addressDetail, "\", \"").concat(isDefault, "\",\"").concat(areaCode, "\")"), function () {
            res.send({
              code: 0,
              success: true,
              message: "地址添加成功！！！"
            });
          });
        });
      });
    }
  });
});
router.post("/api/updateNum", function (req, res) {
  var id = req.body.id;
  var goodsNum = req.body.num;
  connection.query("select * from goods_cart where id=".concat(id), function (error, result) {
    var num = result[0].goods_num;
    connection.query("update goods_cart set goods_num=replace(goods_num,".concat(num, ",").concat(goodsNum, ") where id=").concat(id), function (error1, result1) {
      if (error1 !== null) {
        res.send({
          code: 500,
          success: false,
          message: "修改失败！！！"
        });
      }

      res.send({
        code: 0,
        success: true,
        message: "修改成功",
        data: result1
      });
    });
  });
});
router.post("/api/deleteCart", function (req, res) {
  var arrId = req.body.arrId;

  var _loop = function _loop(i) {
    connection.query("delete from goods_cart where id=".concat(arrId[i]), function () {
      if (i === arrId.length - 1) {
        res.send({
          code: 0,
          success: true,
          message: "删除成功！！！"
        });
      }
    });
  };

  for (var i = 0; i < arrId.length; i++) {
    _loop(i);
  }
});
router.post("/api/selectCart", function (req, res) {
  var token = req.headers.token;

  if (!token.trim()) {
    res.send({
      code: 301,
      success: false,
      message: "请登陆后查看..."
    });
  } else {
    var tokenObj = jwt.decode(token);
    connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
      if (error !== null) {
        res.send({
          code: 500,
          success: true,
          message: result.message
        });
      } else {
        var uId = result[0].id;
        connection.query("select * from goods_cart where uId=".concat(uId), function (error1, result1) {
          if (error1 !== null) {
            res.send({
              code: 500,
              success: true,
              message: result.message
            });
          } else {
            res.send({
              code: 0,
              success: true,
              data: result1
            });
          }
        });
      }
    });
  }
});
router.post("/api/addCart", function (req, res) {
  var token = req.headers.token;
  var tokenObj = jwt.decode(token);
  var goodsId = req.body.goodsId;

  if (getTimeToken(tokenObj.exp)) {
    res.send({
      code: 0,
      success: false,
      message: "登录超时！！！",
      data: {
        code: 1000
      }
    });
  } else {
    connection.query("select * from user where tel=".concat(tokenObj.tel), function (error, result) {
      var uId = result[0].id;
      connection.query("select * from goods_list where id=".concat(goodsId), function (error1, result1) {
        var goodsName = result1[0].name;
        var goodsPrice = result1[0].price;
        var goodsImgUrl = result1[0].imgUrl;
        connection.query("select * from goods_cart where uId=".concat(uId, " and goods_id=").concat(goodsId), function (error4, result4) {
          if (result4.length > 0) {
            var goods_num_old = result4[0].goods_num;
            connection.query("update goods_cart set goods_num = replace(goods_num,".concat(goods_num_old, ",").concat(parseInt(goods_num_old) + 1, ") where id=").concat(result4[0].id), function (error5) {
              if (error5 !== null) {
                res.send({
                  code: 500,
                  success: false,
                  message: "添加失败",
                  data: error5
                });
                return;
              }

              res.send({
                code: 0,
                success: true,
                message: "添加成功"
              });
            });
          } else {
            connection.query("insert into goods_cart (uid,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values (\"".concat(uId, "\",\"").concat(goodsId, "\",\"").concat(goodsName, "\",\"").concat(goodsPrice, "\",\"1\",\"").concat(goodsImgUrl, "\")"), function (error2) {
              if (error2 !== null) {
                res.send({
                  code: 500,
                  success: false,
                  message: "添加失败",
                  data: error2
                });
                return;
              }

              res.send({
                code: 0,
                success: true,
                message: "添加成功"
              });
            });
          }
        });
      });
    });
  }
});
router.post("/api/register", function (req, res) {
  var params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd
  };
  connection.query(user.registerData(params), function (error) {
    if (error) {
      res.send({
        code: 500,
        message: error
      });
      return;
    }

    connection.query(user.queryUserTel(params), function (error3, results3) {
      res.send({
        code: 0,
        message: "",
        success: true,
        data: results3[0]
      });
    });
  });
});
router.post("/api/insertuser", function (req, res) {
  var params = {
    userTel: req.body.userTel
  };
  connection.query(user.queryUserTel(params), function (error, results) {
    if (results.length > 0) {
      var tel = results[0].tel;
      var id = results[0].id;
      var payload = {
        tel: tel
      };
      var secret = "tbs";
      var token = jwt.sign(payload, secret, {
        expiresIn: 60
      });
      connection.query("update user set token=\"".concat(token, "\" where id=").concat(id), function (error2) {
        if (error2 !== null) {
          res.send({
            code: 301,
            success: false,
            message: "登录失败！！！"
          });
        } else {
          results[0].token = token;
          res.send({
            code: 0,
            success: true,
            data: results[0]
          });
        }
      });
    } else {
      connection.query(user.insertData(params), function () {
        connection.query(user.queryUserTel(params), function (error3, results3) {
          if (results3.length > 0) {
            res.send({
              code: 0,
              success: true,
              data: results3[0]
            });
          }
        });
      });
    }
  });
});
router.post("/api/code", function (req, res) {
  res.send({
    code: 0,
    data: {
      code: "000000"
    }
  });
});
router.post("/api/login", function (req, res) {
  var params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd
  };
  var payload = {
    tel: params.userTel
  };
  var secret = "tbs";
  var token = jwt.sign(payload, secret, {
    expiresIn: 60
  });
  connection.query(user.queryUserTel(params), function (error, results) {
    if (results.length > 0) {
      connection.query(user.queryUserPwd(params), function (error1, results1) {
        if (results1.length > 0) {
          connection.query("update user set token=".concat(token, " where id=").concat(results1[0].id), function () {
            res.send({
              code: 0,
              success: true,
              message: "登录成功！！！",
              data: results1[0]
            });
          });
        } else {
          res.send({
            code: 301,
            success: false,
            message: "密码错误"
          });
        }
      });
    } else {
      res.send({
        code: 301,
        success: false,
        message: "手机号不存在"
      });
    }
  });
});
router.get("/api/goods/id", function (req, res) {
  var id = req.query.id;
  connection.query("select * from goods_list where id=".concat(id), function (err, results) {
    if (err) {
      res.send({
        code: 500,
        message: "Error"
      });
    }

    res.send({
      code: 0,
      data: results[0]
    });
  });
});
router.get("/api/goods/list", function (req, res) {
  res.send({
    code: 0,
    data: [{
      id: 1,
      name: "推荐",
      data: {
        id: 0,
        name: "推荐",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 2,
      name: "绿茶",
      data: {
        id: 1,
        name: "绿茶",
        list: [{
          id: 0,
          name: "铁观音2",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香2",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶3",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井4",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 3,
      name: "红茶",
      data: {
        id: 3,
        name: "红茶",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 4,
      name: "黑茶",
      data: {
        id: 4,
        name: "黑茶",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 5,
      name: "茶具",
      data: {
        id: 5,
        name: "茶具",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 6,
      name: "铁观音",
      data: {
        id: 6,
        name: "铁观音",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }, {
      id: 7,
      name: "大红袍",
      data: {
        id: 7,
        name: "大红袍",
        list: [{
          id: 0,
          name: "铁观音",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 2,
          name: "鸭屎香",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 3,
          name: "紫砂壶",
          imgUrl: "./images/list1.jpeg"
        }, {
          id: 4,
          name: "龙井",
          imgUrl: "./images/list1.jpeg"
        }]
      }
    }]
  });
});
router.get("/api/goods/shopList", function (req, res) {
  // eslint-disable-next-line no-unused-vars
  var _Object$keys = Object.keys(req.query),
      _Object$keys2 = _slicedToArray(_Object$keys, 2),
      searchName = _Object$keys2[0],
      orderName = _Object$keys2[1];

  var _Object$values = Object.values(req.query),
      _Object$values2 = _slicedToArray(_Object$values, 2),
      name = _Object$values2[0],
      order = _Object$values2[1];

  connection.query("select * from goods_list where name like \"%".concat(name, "%\"") + (orderName === "price" || orderName === "num" ? " order by ".concat(orderName, " ").concat(order) : ""), function (error, results) {
    res.send({
      code: 0,
      data: results || []
    });
  });
}); //首页铁观音的数据

router.get("/api/index_list/2/data/1", function (req, res) {
  res.send({
    code: 0,
    data: [{
      id: 1,
      type: "adList",
      data: [{
        id: 1,
        imgUrl: "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg"
      } // {
      //   id: 2,
      //   imgUrl: "./images/like.jpeg",
      // },
      ]
    }, {
      id: 1,
      type: "iconsList",
      data: [{
        id: 1,
        title: "自饮茶",
        imgUrl: "./images/icons1.png"
      }, {
        id: 2,
        title: "茶具",
        imgUrl: "./images/icons2.png"
      }, {
        id: 3,
        title: "茶礼盒",
        imgUrl: "./images/icons3.png"
      }, {
        id: 4,
        title: "领福利",
        imgUrl: "./images/icons4.png"
      }, {
        id: 5,
        title: "官方验证",
        imgUrl: "./images/icons5.png"
      }]
    }, {
      id: 3,
      type: "likeList",
      data: [{
        id: 1,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 2,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 3,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 4,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 5,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 6,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 7,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 8,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 9,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 10,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 11,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 12,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 13,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 14,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 15,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 16,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }]
    }]
  });
}); //首页大红袍的数据

router.get("/api/index_list/0/data/1", function (res, req) {
  req.send({
    code: 0,
    data: {
      toopBar: [{
        id: 0,
        label: "推荐"
      }, {
        id: 1,
        label: "大红袍"
      }, {
        id: 2,
        label: "铁观音"
      }, {
        id: 3,
        label: "绿茶"
      }, {
        id: 4,
        label: "普洱"
      }, {
        id: 5,
        label: "茶具"
      }, {
        id: 6,
        label: "花茶"
      }],
      data: [{
        id: 0,
        type: "swiperList",
        data: [{
          id: 1,
          imgUrl: "http://112.74.81.230:3000/upload_7d0b10bc8f28d99c130b8ed57ee5f9de.jpeg"
        }, {
          id: 2,
          imgUrl: "http://112.74.81.230:3000/upload_8ccce325d4ea88e69ed291c67d3acb29.jpeg"
        }, {
          id: 3,
          imgUrl: "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg"
        }, {
          id: 4,
          imgUrl: "http://112.74.81.230:3000/upload_e09feaea239519c891a6ce8a1bf396f5.jpeg"
        }, {
          id: 5,
          imgUrl: "http://112.74.81.230:3000/upload_a2d1797dbd0e60896473b0cec2a71f86.jpeg"
        }]
      }, {
        id: 1,
        type: "iconsList",
        data: [{
          id: 1,
          title: "自饮茶",
          imgUrl: "./images/icons1.png"
        }, {
          id: 2,
          title: "茶具",
          imgUrl: "./images/icons2.png"
        }, {
          id: 3,
          title: "茶礼盒",
          imgUrl: "./images/icons3.png"
        }, {
          id: 4,
          title: "领福利",
          imgUrl: "./images/icons4.png"
        }, {
          id: 5,
          title: "官方验证",
          imgUrl: "./images/icons5.png"
        }]
      }, {
        id: 2,
        type: "recommendList",
        data: [{
          id: 1,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
          price: 68
        }, {
          id: 2,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
          price: 68
        }, {
          id: 3,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
          price: 68
        }, {
          id: 4,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
          price: 68
        }]
      }, {
        id: 4,
        type: "likeList",
        data: [{
          id: 1,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg"
        }, {
          id: 2,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg"
        }, {
          id: 3,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg"
        }, {
          id: 4,
          name: "龙井1号铁罐茶250g",
          content: "鲜爽甘醇 口粮首选",
          imgUrl: "http://112.74.81.230/images/goodsImg1.jpg"
        }]
      }]
    }
  });
});
router.get("/api/index_list/1/data/1", function (req, res) {
  res.send({
    code: 0,
    data: [{
      id: 1,
      type: "adList",
      data: [{
        id: 1,
        imgUrl: "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg"
      } // {
      //   id: 2,
      //   imgUrl: "./images/dhp.jpeg",
      // },
      ]
    }, {
      id: 2,
      type: "likeList",
      data: [{
        id: 1,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 2,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }, {
        id: 3,
        imgUrl: "./images/like.jpeg",
        name: "建盏茶具套装 红色芝麻毫 12件套",
        price: 299
      }]
    }]
  });
});
module.exports = router;