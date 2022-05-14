<template>
  <div class="recommend-wrap">
    <Card>
      <span slot="tie">爆款推荐</span>
    </Card>
    <ul class="recommend">
      <li class="recommend-item" v-for="item in recommendList" :key="item.id">
        <h2>
          <img class="left" :src="item.imgUrl" alt="" srcset="" />
        </h2>
        <div class="right">
          <h3>{{ item.name }}</h3>
          <p>{{ item.content }}</p>
          <div class="price">
            <span>￥</span>
            <b>{{ item.price }}</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from "@/components/home/Card";
export default {
  name: "Recommend",
  components: {
    Card,
  },
  props: {
    recommendList: Array,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.recommend-wrap .recommend {
  margin: 14px;
}
.recommend-wrap .recommend .recommend-item {
  display: flex;
  justify-content: space-between;
  padding: 22.5px 30px;
  border: 1px solid #eee;
  border-radius: 20px;
  margin-bottom: 10px;
  box-shadow: 4px #888;
}
.recommend-wrap .recommend .recommend-item img {
  width: 160px;
  height: 200px;
  border-radius: 20px;
  vertical-align: middle;
}
.recommend-wrap .recommend .recommend-item .right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  font-size: 28px;
  width: 100%;
  padding: 0 20px;
}
.recommend-wrap .recommend .recommend-item .right .price {
  width: 100%;
  text-align: right;
  color: red;
}
</style>
