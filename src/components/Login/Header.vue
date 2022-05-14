<template>
  <div class="login-header">
    <div class="login-header-left">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="login-header-center">
      <slot>
        <span>登录</span>
      </slot>
    </div>
    <div class="login-header-right">
      <i class="iconfont icon-kefu"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginHeader",
};
</script>

<style lang="less" scoped>
.login-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
  height: 88px;
  background: #1296db;
  box-sizing: border-box;
  color: #fff;
  .login-header-left,
  .login-header-right {
    i {
      font-size: 38px;
    }
  }
  .login-header-center {
    font-size: 38px;
  }
}
</style>
