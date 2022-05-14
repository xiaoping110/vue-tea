<template>
  <div class="my">
    <header class="my-header">
      <div class="login-btn" @click="goLogin" v-if="!loginStatus">
        登录 / 注册
      </div>
      <div v-else class="user-info">
        <div class="user-img">
          <img :src="userInfo.imgUrl" />
        </div>
        {{ userInfo.nickName }}
      </div>
    </header>
    <section class="my-main">
      <ul>
        <li @click="goPath">地址管理</li>
      </ul>
    </section>
    <div class="logout-wrap" @click="USER_LOGOUT" v-if="loginStatus">
      退出登录
    </div>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "../components/common/Tabbar.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "My",
  components: { Tabbar },
  computed: {
    ...mapState({
      loginStatus: (state) => state.user.loginStatus,
      userInfo: (state) => state.user.userInfo,
    }),
  },
  methods: {
    ...mapMutations(["USER_LOGOUT"]),
    goLogin() {
      this.$router.push({
        path: "/login",
      });
    },
    goPath() {
      this.$router.push("/path");
    },
  },
};
</script>

<style lang="less" scoped>
.my {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  .my-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 320px;
    background: #1296db;
    .login-btn {
      height: 72px;
      font-size: 32px;
      background: #f6ab32;
      display: inline-block;
      line-height: 72px;
      border-radius: 10px;
      border: 1px solid #ccc;
      padding: 0 20px;
      color: #fff;
    }
    .user-info {
      display: flex;
      flex-direction: column;
      font-size: 48px;
      align-items: center;
      .user-img {
        width: 150px;
        height: 150px;
        margin-bottom: 10px;

        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
    }
  }
  .my-main {
    flex: 1;
    overflow: hidden;
    ul {
      li {
        font-size: 28px;
        padding: 20px;
      }
    }
  }

  .logout-wrap {
    width: 90%;
    box-sizing: border-box;
    background: #1296db;
    text-align: center;
    margin: 0 auto 120px;
    font-size: 32px;
    height: 88px;
    border-radius: 20px;
    line-height: 88px;
    color: #fff;
    font-weight: 600;
  }
}
</style>
