const User = {
  queryUserTel(option) {
    return `select * from user where tel=${option.userTel}`;
  },
  queryUserPwd(option) {
    return `select * from user where (tel=${option.userTel}) and (pwd=${option.userPwd})`;
  },
  insertData(option) {
    let jwt = require("jsonwebtoken");
    let payload = { tel: option.userTel };
    let secret = "tbs";
    let token = jwt.sign(payload, secret, {
      expiresIn: 60,
    });

    return `insert into user (tel,pwd,imgUrl,nickName,token) values (${option.userTel},"666666","/images/user.jpeg",${option.userTel},"${token}")`;
  },
  registerData(option) {
    return `insert into user (tel,pwd,imgUrl,nickName,token) values (${option.userTel},${option.userPwd},"580.jpeg","1","1")`;
  },
};

exports = module.exports = User;
