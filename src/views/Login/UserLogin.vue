<template>
  <div class="login">
    <Header></Header>
    <section class="login-main">
      <div class="login-tel">
        <input
          type="text"
          placeholder="请输入手机号..."
          v-model="userTel"
          pattern="[0-9]*"
        />
      </div>
      <div class="login-code">
        <input
          type="text"
          placeholder="请输入密码..."
          v-model="userPwd"
          pattern="[0-9]*"
        />
      </div>

      <div class="login-btn" @click="login">
        <div>登录</div>
      </div>
      <div class="login-tab">
        <span @click="goUserLogin">短信登录</span>
        <span>找回密码</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>

    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "@/components/common/Tabbar.vue";
import Header from "@/components/Login/Header.vue";
import { Toast } from "mint-ui";
import { mapMutations } from "vuex";

export default {
  name: "UserLogin",
  data() {
    return {
      userTel: "",
      userPwd: "",
      rules: {
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: "手机号不能为空，并且为11位",
        },

        userPwd: {
          rule: /^\w{6,12}$/,
          msg: "密码不能为空，并要求6~12位",
        },
      },
    };
  },
  components: { Tabbar, Header },
  methods: {
    ...mapMutations(["USER_LOGIN"]),
    goRegister() {
      this.$router.push("/register");
    },
    async login() {
      //前端验证
      if (!this.validata("userTel")) return;
      if (!this.validata("userPwd")) return;
      //发送请求,后端验证
      const result = await this.$API.user.login({
        userTel: this.userTel,
        userPwd: this.userPwd,
      });

      if (!result.success) return;
      this.USER_LOGIN(result.data);
      this.$router.push("/my");
    },
    goUserLogin() {
      this.$router.push("/login");
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
        width: 100%;
        height: 88px;
        line-height: 88px;
        outline: none;
        border-radius: 10px;
        padding: 0 12px;
        border: 1px solid #ccc;
        box-sizing: border-box;
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
