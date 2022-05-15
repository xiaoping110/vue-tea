<template>
  <div class="login">
    <Header></Header>
    <section class="login-main">
      <div class="login-tel">
        <input
          type="text"
          v-model="userTel"
          placeholder="请输入手机号..."
          pattern="[0-9]*"
        />
      </div>
      <div class="login-code">
        <input
          type="text"
          v-model="userCode"
          placeholder="请输入短信验证码..."
          pattern="[0-9]*"
        />
        <button :disabled="disabled" @click="sendCode">{{ code.msg }}</button>
      </div>

      <div class="login-btn">
        <div @click="login">登录</div>
      </div>
      <div class="login-tab">
        <span @click="goUserLogin">密码登录</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>

    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/components/Login/Header.vue";
import { mapMutations } from "vuex";
import { Toast } from "mint-ui";
export default {
  name: "Login",
  data() {
    return {
      userTel: "",
      disabled: false,
      userCode: "",
      rules: {
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: "手机号不能为空，并且为11位",
        },
      },
      codeNum: 6,
      code: { msg: "获取短信验证码" },
      codeData: "",
    };
  },
  components: { Tabbar, Header },
  methods: {
    ...mapMutations(["USER_LOGIN"]),
    goRegister() {
      this.$router.push("/register");
    },
    goUserLogin() {
      this.$router.push("/userlogin");
    },
    async sendCode() {
      if (!this.validata("userTel")) return;

      const result = await this.$API.user.getCode({ phone: this.userTel });
      this.codeData = result.data.code;
      this.code.msg = `重新获取(${this.codeNum}S)`;

      this.disabled = true;
      let timer = setInterval(() => {
        --this.codeNum;
        if (this.codeNum === 0) {
          clearInterval(timer);
          this.codeNum = 6;
          this.disabled = false;
          this.code.msg = "获取短信验证码";
          return;
        }
        this.code.msg = `重新获取(${this.codeNum}S)`;
      }, 1000);
    },

    validata(key) {
      let bool = true;
      if (!this.rules[key].rule.test(this[key])) {
        Toast(this.rules[key].msg);
        bool = false;
        return false;
      }
      return bool;
    },
    async login() {
      if (this.codeData !== this.userCode) {
        Toast("验证码错误！！！");
        return;
      }

      const result = await this.$API.user.addUser({ userTel: this.userTel });
      if (!result.success) return;
      this.USER_LOGIN(result.data);
      // let toPath = this.$route.query.redirect.trim()
      //   ? this.$route.query.redirect
      //   : "/my";
      this.$router.push("/my");
    },
  },
};
</script>

<style lang="less" scoped>
.login {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  font-size: 28px;
  .login-main {
    display: flex;
    flex-direction: column;
    align-items: center;

    & > div {
      width: 670px;
      height: 88px;
      line-height: 88px;
      box-sizing: border-box;
      margin-top: 40px;

      input {
        background: #fff;
        height: 88px;
        line-height: 88px;
        outline: none;
        border-radius: 10px;
        padding: 0 12px;
        border: 1px solid #ccc;
        box-sizing: border-box;
        vertical-align: middle;
      }
      &.login-tel input {
        width: 100%;
      }
      &.login-code {
        input {
          width: 65%;
          border-radius: 10px 0 0 10px;
        }
        button {
          height: 88px;
          line-height: 88px;
          border: 1px solid #1296db;
          background: #1296db;
          color: #fff;
          border-radius: 0 10px 10px 0;
          box-sizing: border-box;
          border: 1px solid #1296db;
          padding: 0 22px;
          width: 35%;
          vertical-align: middle;
        }
      }
    }

    .login-btn {
      border-radius: 10px;
      background: #1296db;
      text-align: center;
      color: #fff;
    }

    .login-tab {
      display: flex;
      justify-content: space-between;
      font-size: 32px;
    }
  }
}
</style>
