<template>
  <div class="ad-wrap">
    <ul>
      <li v-for="item in adList" :key="item.id">
        <img :src="item.imgUrl" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Ad",
  props: {
    adList: Array,
  },
};
</script>

<style lang="less" scoped>
.ad-wrap {
  width: 100vw;
  // height: 224px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
