<template>
  <div
    class="path-header"
    @click="
      routerFlg === 'one' ? $router.back() : $router.replace({ name: 'My' })
    "
  >
    <i class="iconfont icon-fanhui"></i>
    <slot>
      <span>我的地址</span>
    </slot>
    <i class="iconfont icon-kefu"></i>
  </div>
</template>

<script>
export default {
  name: "PathHeader",
  props: {
    routerFlg: String,
  },
};
</script>

<style lang="less" scoped>
.path-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 88px;
  background: #1296db;
  padding: 0 20px;

  color: #fff;
  .iconfont {
    font-size: 44px;
  }
  span {
    font-size: 36px;
  }
}
</style>
