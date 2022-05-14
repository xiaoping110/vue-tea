<template>
  <div class="home-wrap">
    <div class="headers">
      <Header></Header>
      <ly-tabs v-model="selectedId" @change="changeTab">
        <ly-tab-item
          v-for="(item, index) in toopBar"
          :key="index"
          :name="index"
          :title="item.label"
        ></ly-tab-item>
      </ly-tabs>
    </div>
    <section class="home-wrapper" ref="homeWrapper">
      <div class="content">
        <div v-for="(item, index) in newData" :key="index">
          <Swiper v-if="item.type === 'swiperList'" :swiperList="item.data" />
          <Icons v-if="item.type === 'iconsList'" :iconsList="item.data" />
          <Recommend
            v-if="item.type === 'recommendList'"
            :recommendList="item.data"
          />
          <Ad v-if="item.type === 'adList'" :adList="item.data" />

          <Like v-if="item.type === 'likeList'" :likeList="item.data" />
        </div>
      </div>
    </section>

    <Tabbar />
  </div>
</template>

<script>
import Header from "@/components/home/Header";
import Swiper from "@/components/home/Swiper.vue";
import Icons from "@/components/home/Icons";
import Recommend from "@/components/home/Recommend";
import Like from "@/components/home/Like";
import Ad from "@/components/home/Ad";
import Tabbar from "@/components/common/Tabbar.vue";

//引入插件
import BetterScroll from "better-scroll";
export default {
  name: "Home",
  components: { Tabbar, Header, Swiper, Icons, Recommend, Like, Ad },
  data() {
    return {
      names: "Home",
      selectedId: 0,
      toopBar: [],
      newData: [],
    };
  },
  created() {
    this.getData();
  },
  mounted() {},
  methods: {
    async getData() {
      const res = await this.$API.home.getShowInitInfo();
      this.toopBar = Object.freeze(res.data.toopBar);
      this.newData = Object.freeze(res.data.data);
    },
    async addData(index) {
      const res = await this.$API.home.getShowOtherInfo(index);
      if (res.data.constructor != Array) {
        this.newData = Object.freeze(res.data.data);
      } else {
        this.newData = Object.freeze(res.data);
      }
    },
    changeTab(index) {
      this.addData(index);
    },
  },
  watch: {
    newData() {
      this.$nextTick(() => {
        new BetterScroll(this.$refs.homeWrapper, {
          click: true,
        });
      })
    },
  },
};
</script>

<style lang="less" scoped>
.home-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .headers {
    height: 168px;
    z-index: 999;
    .ly-tabs {
      height: 80px;
    }
  }
  .home-wrapper {
    flex: 1;
    overflow: hidden;
    .content {
      padding-bottom: 100px;
    }
  }
}
</style>
