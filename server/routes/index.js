var express = require("express");
var router = express.Router();
var connection = require("../db/sql.js");
var user = require("../db/userSql");
let jwt = require("jsonwebtoken");
let qs = require("qs");
let alipaySdk = require("../db/alipay.js");
let AlipayFormData = require("alipay-sdk/lib/form").default;
let axios = require("axios");
function getTimeToken(exp) {
  let getTime = parseInt(new Date().getTime() / 1000);
  if (getTime - exp > 60) {
    return true;
  }
}
/* GET home page. */
router.get("/", function (req, res) {
  res.send({
    code: 0,
    test: "哈哈",
  });
});

router.post("/api/successPayment", (req, res) => {
  let data = qs.parse(req.body.data);
  let out_trade_no = data.out_trade_no;
  let trade_no = data.trade_no;
  const formData = new AlipayFormData();
  formData.setMethod("get");
  formData.addField("bizContent", {
    out_trade_no,
    trade_no,
  });

  const result = alipaySdk.exec(
    "alipay.trade.query",
    {},
    { formData: formData }
  );

  result.then((resData) => {
    axios({
      method: "GET",
      url: resData,
    })
      .then((data) => {
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
        let responseCode = data.data.alipay_trade_query_response;
        if (responseCode.code === "10000") {
          switch (responseCode.trade_status) {
            case "WAIT_BUYER_PAY":
              res.send({
                code: 0,
                success: true,
                message: "未付款！！！",
                data: {
                  code: 0,
                },
              });
              break;
            case "TRADE_SUCCESS":
              connection.query(
                `update  store_order set order_status="3" where order_id=${responseCode.out_trade_no}`,
                (error) => {
                  if (error !== null) {
                    res.send({
                      code: 500,
                      success: false,
                      message: "支付成功,出单失败！！！",
                    });
                  } else {
                    res.send({
                      code: 0,
                      success: true,
                      message: "支付成功！！！",
                      data: {
                        code: 2,
                      },
                    });
                  }
                }
              );
              break;
            default:
              res.send({
                code: 0,
                success: true,
                message: "支付失败！！！",
                data: {
                  code: 2,
                },
              });
          }
        } else if (responseCode.code === "40004") {
          res.send({
            code: 0,
            success: true,
            message: "交易不存在！！！",
          });
        }
      })
      .catch(() => {
        res.send({
          code: 500,
          success: false,
          message: "交易失败！！！",
        });
      });
  });
});

router.post("/api/payMent", (req, res) => {
  let data = qs.parse(req.body.data);
  let { orderId, name, price } = data;
  const formData = new AlipayFormData();
  formData.setMethod("get");
  formData.addField("bizContent", {
    outTradeNo: orderId,
    productCode: "FAST_INSTANT_TRADE_PAY",
    totalAmount: price,
    subject: name,
  });

  formData.addField("returnUrl", "http://localhost:8088/payment");

  const result = alipaySdk.exec(
    "alipay.trade.page.pay",
    {},
    { formData: formData }
  );

  result.then((resp) => {
    res.send({
      code: 0,
      success: true,
      message: "支付中...",
      data: { paymentUrl: resp },
    });
  });
});

router.post("/api/submitOrder", (req, res) => {
  let order_id = req.body.order_id;
  let selectList = req.body.selectList;
  connection.query(
    `update  store_order set order_status="2" where order_id=${order_id}`,
    (error) => {
      if (error !== null) {
        res.send({
          code: 500,
          success: false,
          message: "订单提交失败！！！",
        });
      } else {
        selectList.forEach((item, index) => {
          connection.query(
            `delete from goods_cart where id=${item}`,
            (error) => {
              if (error !== null) {
                res.send({
                  code: 500,
                  success: false,
                  message: "购物车内容删除失败！！！",
                });
              } else {
                if (index === selectList.length - 1) {
                  res.send({
                    code: 0,
                    success: true,
                    message: "订单提交成功！！！",
                  });
                }
              }
            }
          );
        });
      }
    }
  );
});

router.post("/api/addOrder", (req, res) => {
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  let goodsArr = req.body.arr;

  function setTimeNewDateFmt(s) {
    return s < 10 ? "0" + s : s;
  }

  function randomNumber() {
    const now = new Date();
    let month = setTimeNewDateFmt(now.getMonth() + 1);
    let day = setTimeNewDateFmt(now.getDate());
    let hour = setTimeNewDateFmt(now.getHours());
    let minutes = setTimeNewDateFmt(now.getMinutes());
    let seconds = setTimeNewDateFmt(now.getSeconds());

    let orderCode =
      now.getFullYear().toString() +
      month +
      day +
      hour +
      minutes +
      seconds +
      Math.round(Math.random() * 1000000).toString();
    return orderCode;
  }
  let orderId = randomNumber();

  let goodsName = [];
  let goodsPrice = [];
  let goodsNum = [];
  // goodsArr.forEach((v) => {
  //   goodsName.push(v.goods_name);
  //   goodsPrice += v.goods_price * v.goods_num;
  //   goodsNum += Number(v.goods_num);
  // });

  goodsArr.forEach((v) => {
    goodsName.push(v.goods_name);
    goodsPrice.push(v.goods_price * v.goods_num);
    goodsNum.push(v.goods_num);
  });

  connection.query(
    `select * from user where tel=${tokenObj.tel}`,
    (error, result) => {
      let uId = result[0].id;

      // connection.query(
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
      goodsArr.forEach((v, index) => {
        connection.query(
          `insert into store_order (uId,order_id,goods_name,goods_price,goods_num,order_status) values(${uId},"${orderId}","${
            v.goods_name
          }","${v.goods_price * v.goods_num}","${v.goods_num}","1")`,
          (error1) => {
            if (error1 !== null) {
              res.send({
                code: 500,
                success: true,
                message: "订单添加失败！！！",
                data: [orderId],
              });
            } else {
              if (index === goodsArr.length - 1) {
                res.send({
                  code: 0,
                  success: true,
                  message: "订单添加成功！！！",
                  data: [orderId],
                });
              }
            }
          }
        );
      });
    }
  );
});

router.get("/api/deleteAddress", (req, res) => {
  let id = req.query.id;

  connection.query(`delete from address where id=${id}`, (error) => {
    if (error !== null) {
      res.send({
        code: 500,
        success: false,
        message: "地址删除失败！！！",
      });
    } else {
      res.send({
        code: 0,
        success: true,
        message: "地址删除成功！！！",
      });
    }
  });
});

router.post("/api/updateAddress", (req, res) => {
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);

  let body = req.body;

  let [
    id,
    name,
    tel,
    province,
    city,
    county,
    addressDetail,
    isDefault,
    areaCode,
  ] = [
    body.id,
    body.name,
    body.tel,
    body.province,
    body.city,
    body.county,
    body.addressDetail,
    body.isDefault,
    body.areaCode,
  ];
  connection.query(
    `select * from user where tel=${tokenObj.tel}`,
    (error, result) => {
      let uId = result[0].id;

      if (isDefault !== 1) {
        connection.query(
          `update address set name="${name}",tel="${tel}",province="${province}",city="${city}",county="${county}",addressDetail="${addressDetail}",isDefault="${isDefault}",areaCode="${areaCode}" where id=${id} `,
          (error1) => {
            if (error1 !== null) {
              res.send({
                code: 500,
                success: false,
                message: "修改地址失败！！！",
              });
            } else {
              res.send({
                code: 0,
                success: true,
                message: "修改成功！！！",
              });
            }
          }
        );
      } else {
        connection.query(
          `select * from address where uId=${uId} and isDefault="1"`,
          (error6, result6) => {
            let addressId = result6[0].id;
            connection.query(
              `update address set isDefault=replace(isDefault,"1","0") where id=${addressId}`,
              () => {
                connection.query(
                  `update address set name="${name}",tel="${tel}",province="${province}",city="${city}",county="${county}",addressDetail="${addressDetail}",isDefault="${isDefault}",areaCode="${areaCode}" where id=${id} `,
                  () => {
                    if (error !== null) {
                      res.send({
                        code: 500,
                        success: false,
                        message: "修改地址失败！！！",
                      });
                    } else {
                      res.send({
                        code: 0,
                        success: true,
                        message: "修改成功！！！",
                      });
                    }
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});

router.post("/api/selectAddress", (req, res) => {
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);

  connection.query(
    `select * from user where tel=${tokenObj.tel}`,
    (error, result) => {
      let uId = result[0].id;
      connection.query(
        `select * from address where uId=${uId}`,
        (error1, result1) => {
          res.send({
            code: 0,
            success: true,
            message: "查询成功",
            data: result1,
          });
        }
      );
    }
  );
});

router.post("/api/insertAddress", (req, res) => {
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  let body = req.body;

  let [name, tel, province, city, county, addressDetail, isDefault, areaCode] =
    [
      body.name,
      body.tel,
      body.province,
      body.city,
      body.county,
      body.addressDetail,
      body.isDefault,
      body.areaCode,
    ];

  connection.query(
    `select * from user where tel=${tokenObj.tel}`,
    (error, result) => {
      let uId = result[0].id;
      if (isDefault !== 1) {
        connection.query(
          `insert into address (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values ("${uId}","${name}", "${tel}", "${province}", "${city}", "${county}", "${addressDetail}", "${isDefault}","${areaCode}")`,
          () => {
            res.send({
              code: 0,
              success: true,
              message: "地址添加成功！！！",
            });
          }
        );
      } else {
        connection.query(
          `select * from address where uId=${uId} and isDefault="1"`,
          (error2, result2) => {
            let addressId = result2[0].id;

            connection.query(
              `update address set isDefault=replace(isDefault,"1","0") where id=${addressId}`,
              () => {
                connection.query(
                  `insert into address (uId,name, tel, province, city, county, addressDetail, isDefault,areaCode) values ("${uId}","${name}", "${tel}", "${province}", "${city}", "${county}", "${addressDetail}", "${isDefault}","${areaCode}")`,
                  () => {
                    res.send({
                      code: 0,
                      success: true,
                      message: "地址添加成功！！！",
                    });
                  }
                );
              }
            );
          }
        );
      }
    }
  );
});

router.post("/api/updateNum", (req, res) => {
  let id = req.body.id;
  let goodsNum = req.body.num;
  connection.query(
    `select * from goods_cart where id=${id}`,
    (error, result) => {
      let num = result[0].goods_num;
      connection.query(
        `update goods_cart set goods_num=replace(goods_num,${num},${goodsNum}) where id=${id}`,
        (error1, result1) => {
          if (error1 !== null) {
            res.send({
              code: 500,
              success: false,
              message: "修改失败！！！",
            });
          }
          res.send({
            code: 0,
            success: true,
            message: "修改成功",
            data: result1,
          });
        }
      );
    }
  );
});

router.post("/api/deleteCart", (req, res) => {
  let arrId = req.body.arrId;
  for (let i = 0; i < arrId.length; i++) {
    connection.query(`delete from goods_cart where id=${arrId[i]}`, () => {
      if (i === arrId.length - 1) {
        res.send({
          code: 0,
          success: true,
          message: "删除成功！！！",
        });
      }
    });
  }
});

router.post("/api/selectCart", (req, res) => {
  let token = req.headers.token;
  if (!token.trim()) {
    res.send({
      code: 301,
      success: false,
      message: "请登陆后查看...",
    });
  } else {
    let tokenObj = jwt.decode(token);

    connection.query(
      `select * from user where tel=${tokenObj.tel}`,
      (error, result) => {
        if (error !== null) {
          res.send({
            code: 500,
            success: true,
            message: result.message,
          });
        } else {
          let uId = result[0].id;

          connection.query(
            `select * from goods_cart where uId=${uId}`,
            (error1, result1) => {
              if (error1 !== null) {
                res.send({
                  code: 500,
                  success: true,
                  message: result.message,
                });
              } else {
                res.send({
                  code: 0,
                  success: true,
                  data: result1,
                });
              }
            }
          );
        }
      }
    );
  }
});

router.post("/api/addCart", (req, res) => {
  let token = req.headers.token;
  let tokenObj = jwt.decode(token);
  let goodsId = req.body.goodsId;

  if (getTimeToken(tokenObj.exp)) {
    res.send({
      code: 0,
      success: false,
      message: "登录超时！！！",
      data: {
        code: 1000,
      },
    });
  } else {
    connection.query(
      `select * from user where tel=${tokenObj.tel}`,
      (error, result) => {
        let uId = result[0].id;
        connection.query(
          `select * from goods_list where id=${goodsId}`,
          (error1, result1) => {
            let goodsName = result1[0].name;
            let goodsPrice = result1[0].price;
            let goodsImgUrl = result1[0].imgUrl;

            connection.query(
              `select * from goods_cart where uId=${uId} and goods_id=${goodsId}`,
              (error4, result4) => {
                if (result4.length > 0) {
                  let goods_num_old = result4[0].goods_num;
                  connection.query(
                    `update goods_cart set goods_num = replace(goods_num,${goods_num_old},${
                      parseInt(goods_num_old) + 1
                    }) where id=${result4[0].id}`,
                    (error5) => {
                      if (error5 !== null) {
                        res.send({
                          code: 500,
                          success: false,
                          message: "添加失败",
                          data: error5,
                        });
                        return;
                      }
                      res.send({
                        code: 0,
                        success: true,
                        message: "添加成功",
                      });
                    }
                  );
                } else {
                  connection.query(
                    `insert into goods_cart (uid,goods_id,goods_name,goods_price,goods_num,goods_imgUrl) values ("${uId}","${goodsId}","${goodsName}","${goodsPrice}","1","${goodsImgUrl}")`,
                    (error2) => {
                      if (error2 !== null) {
                        res.send({
                          code: 500,
                          success: false,
                          message: "添加失败",
                          data: error2,
                        });
                        return;
                      }
                      res.send({
                        code: 0,
                        success: true,
                        message: "添加成功",
                      });
                    }
                  );
                }
              }
            );
          }
        );
      }
    );
  }
});

router.post("/api/register", (req, res) => {
  const params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd,
  };

  connection.query(user.registerData(params), (error) => {
    if (error) {
      res.send({
        code: 500,
        message: error,
      });
      return;
    }

    connection.query(user.queryUserTel(params), (error3, results3) => {
      res.send({
        code: 0,
        message: "",
        success: true,
        data: results3[0],
      });
    });
  });
});

router.post("/api/insertuser", (req, res) => {
  let params = {
    userTel: req.body.userTel,
  };
  connection.query(user.queryUserTel(params), (error, results) => {
    if (results.length > 0) {
      let tel = results[0].tel;
      let id = results[0].id;
      let payload = { tel };
      let secret = "tbs";
      let token = jwt.sign(payload, secret, {
        expiresIn: 60,
      });

      connection.query(
        `update user set token="${token}" where id=${id}`,
        (error2) => {
          if (error2 !== null) {
            res.send({
              code: 301,
              success: false,
              message: "登录失败！！！",
            });
          } else {
            results[0].token = token;
            res.send({
              code: 0,
              success: true,
              data: results[0],
            });
          }
        }
      );
    } else {
      connection.query(user.insertData(params), () => {
        connection.query(user.queryUserTel(params), (error3, results3) => {
          if (results3.length > 0) {
            res.send({
              code: 0,
              success: true,
              data: results3[0],
            });
          }
        });
      });
    }
  });
});

router.post("/api/code", (req, res) => {
  res.send({
    code: 0,
    data: {
      code: "000000",
    },
  });
});

router.post("/api/login", (req, res) => {
  let params = {
    userTel: req.body.userTel,
    userPwd: req.body.userPwd,
  };

  let payload = { tel: params.userTel };
  let secret = "tbs";
  let token = jwt.sign(payload, secret, {
    expiresIn: 60,
  });

  connection.query(user.queryUserTel(params), (error, results) => {
    if (results.length > 0) {
      connection.query(user.queryUserPwd(params), (error1, results1) => {
        if (results1.length > 0) {
          connection.query(
            `update user set token=${token} where id=${results1[0].id}`,
            () => {
              res.send({
                code: 0,
                success: true,
                message: "登录成功！！！",
                data: results1[0],
              });
            }
          );
        } else {
          res.send({
            code: 301,
            success: false,
            message: "密码错误",
          });
        }
      });
    } else {
      res.send({
        code: 301,
        success: false,
        message: "手机号不存在",
      });
    }
  });
});

router.get("/api/goods/id", (req, res) => {
  let id = req.query.id;
  connection.query(
    `select * from goods_list where id=${id}`,
    (err, results) => {
      if (err) {
        res.send({
          code: 500,
          message: "Error",
        });
      }
      res.send({
        code: 0,
        data: results[0],
      });
    }
  );
});

router.get("/api/goods/list", (req, res) => {
  res.send({
    code: 0,
    data: [
      {
        id: 1,
        name: "推荐",
        data: {
          id: 0,
          name: "推荐",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 2,
        name: "绿茶",
        data: {
          id: 1,
          name: "绿茶",
          list: [
            {
              id: 0,
              name: "铁观音2",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香2",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶3",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井4",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 3,
        name: "红茶",
        data: {
          id: 3,
          name: "红茶",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 4,
        name: "黑茶",
        data: {
          id: 4,
          name: "黑茶",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 5,
        name: "茶具",
        data: {
          id: 5,
          name: "茶具",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 6,
        name: "铁观音",
        data: {
          id: 6,
          name: "铁观音",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
      {
        id: 7,
        name: "大红袍",
        data: {
          id: 7,
          name: "大红袍",
          list: [
            {
              id: 0,
              name: "铁观音",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 2,
              name: "鸭屎香",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 3,
              name: "紫砂壶",
              imgUrl: "./images/list1.jpeg",
            },
            {
              id: 4,
              name: "龙井",
              imgUrl: "./images/list1.jpeg",
            },
          ],
        },
      },
    ],
  });
});

router.get("/api/goods/shopList", (req, res) => {
  // eslint-disable-next-line no-unused-vars
  let [searchName, orderName] = Object.keys(req.query);
  let [name, order] = Object.values(req.query);
  connection.query(
    `select * from goods_list where name like "%${name}%"` +
      (orderName === "price" || orderName === "num"
        ? ` order by ${orderName} ${order}`
        : ""),
    (error, results) => {
      res.send({
        code: 0,
        data: results || [],
      });
    }
  );
});

//首页铁观音的数据
router.get("/api/index_list/2/data/1", function (req, res) {
  res.send({
    code: 0,
    data: [
      {
        id: 1,
        type: "adList",
        data: [
          {
            id: 1,
            imgUrl:
              "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg",
          },
          // {
          //   id: 2,
          //   imgUrl: "./images/like.jpeg",
          // },
        ],
      },
      {
        id: 1,
        type: "iconsList",
        data: [
          {
            id: 1,
            title: "自饮茶",
            imgUrl: "./images/icons1.png",
          },
          {
            id: 2,
            title: "茶具",
            imgUrl: "./images/icons2.png",
          },
          {
            id: 3,
            title: "茶礼盒",
            imgUrl: "./images/icons3.png",
          },
          {
            id: 4,
            title: "领福利",
            imgUrl: "./images/icons4.png",
          },
          {
            id: 5,
            title: "官方验证",
            imgUrl: "./images/icons5.png",
          },
        ],
      },
      {
        id: 3,
        type: "likeList",
        data: [
          {
            id: 1,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 2,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 3,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 4,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 5,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 6,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 7,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 8,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 9,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 10,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 11,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 12,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 13,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 14,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 15,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 16,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
        ],
      },
    ],
  });
});
//首页大红袍的数据

router.get("/api/index_list/0/data/1", (res, req) => {
  req.send({
    code: 0,
    data: {
      toopBar: [
        { id: 0, label: "推荐" },
        { id: 1, label: "大红袍" },
        { id: 2, label: "铁观音" },
        { id: 3, label: "绿茶" },
        { id: 4, label: "普洱" },
        { id: 5, label: "茶具" },
        { id: 6, label: "花茶" },
      ],
      data: [
        {
          id: 0,
          type: "swiperList",
          data: [
            {
              id: 1,
              imgUrl:
                "http://112.74.81.230:3000/upload_7d0b10bc8f28d99c130b8ed57ee5f9de.jpeg",
            },
            {
              id: 2,
              imgUrl:
                "http://112.74.81.230:3000/upload_8ccce325d4ea88e69ed291c67d3acb29.jpeg",
            },
            {
              id: 3,
              imgUrl:
                "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg",
            },
            {
              id: 4,
              imgUrl:
                "http://112.74.81.230:3000/upload_e09feaea239519c891a6ce8a1bf396f5.jpeg",
            },
            {
              id: 5,
              imgUrl:
                "http://112.74.81.230:3000/upload_a2d1797dbd0e60896473b0cec2a71f86.jpeg",
            },
          ],
        },
        {
          id: 1,
          type: "iconsList",
          data: [
            { id: 1, title: "自饮茶", imgUrl: "./images/icons1.png" },
            { id: 2, title: "茶具", imgUrl: "./images/icons2.png" },
            { id: 3, title: "茶礼盒", imgUrl: "./images/icons3.png" },
            { id: 4, title: "领福利", imgUrl: "./images/icons4.png" },
            { id: 5, title: "官方验证", imgUrl: "./images/icons5.png" },
          ],
        },
        {
          id: 2,
          type: "recommendList",
          data: [
            {
              id: 1,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
              price: 68,
            },
            {
              id: 2,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
              price: 68,
            },
            {
              id: 3,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
              price: 68,
            },
            {
              id: 4,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
              price: 68,
            },
          ],
        },
        {
          id: 4,
          type: "likeList",
          data: [
            {
              id: 1,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
            },
            {
              id: 2,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
            },
            {
              id: 3,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
            },
            {
              id: 4,
              name: "龙井1号铁罐茶250g",
              content: "鲜爽甘醇 口粮首选",
              imgUrl: "http://112.74.81.230/images/goodsImg1.jpg",
            },
          ],
        },
      ],
    },
  });
});

router.get("/api/index_list/1/data/1", (req, res) => {
  res.send({
    code: 0,
    data: [
      {
        id: 1,
        type: "adList",
        data: [
          {
            id: 1,
            imgUrl:
              "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg",
          },
          // {
          //   id: 2,
          //   imgUrl: "./images/dhp.jpeg",
          // },
        ],
      },
      {
        id: 2,
        type: "likeList",
        data: [
          {
            id: 1,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 2,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
          {
            id: 3,
            imgUrl: "./images/like.jpeg",
            name: "建盏茶具套装 红色芝麻毫 12件套",
            price: 299,
          },
        ],
      },
    ],
  });
});

module.exports = router;
