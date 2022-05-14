<template>
  <div class="like-wrap">
    <Card>
      <span slot="tie">猜你喜欢</span>
    </Card>
    <ul class="like">
      <li
        class="like-item"
        v-for="item in likeList"
        :key="item.id"
        @click="goDetail(item.id)"
      >
        <h2>
          <img class="left" v-lazy="item.imgUrl" alt="" srcset="" />
        </h2>

        <h3>{{ item.name }}</h3>

        <div class="price">
          <span>￥</span>
          <b>{{ item.price }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from "@/components/home/Card";
// eslint-disable-next-line no-unused-vars
import { lazyLoad } from "mint-ui";
export default {
  name: "Like1",
  components: {
    Card,
  },
  props: {
    likeList: Array,
  },
  data() {
    return {};
  },
  methods: {
    /**
     * 显示传值：path + query  隐式传值：name + params
     */
    goDetail(id) {
      this.$router.push({
        path: "/detail",
        query: {
          id,
        },
      });
    },
  },
};
</script>

<style scoped>
.like-wrap .like {
  display: flex;
  flex-wrap: wrap;
}
.like-wrap .like .like-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 50vw;
  box-sizing: border-box;
  padding: 20px;
  margin-bottom: 10px;
}
.like-wrap .like .like-item img {
  width: 100%;
  height: 200px;
  vertical-align: middle;
}
.like-wrap .like .like-item {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 24px;
}
.like-wrap .like .like-item .price {
  width: 100%;
  text-align: right;
}
.like img[lazy="loading"] {
  background: red;
}
</style>
