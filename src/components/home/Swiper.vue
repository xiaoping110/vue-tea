<template>
  <div class="swiper-wrap">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="item in swiperList" :key="item.id">
        <img :src="item.imgUrl" />
      </swiper-slide>

      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
  </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";

export default {
  name: "Swiper",
  components: {
    swiper,
    swiperSlide,
  },
  props: {
    swiperList: Array,
  },
  data() {
    return {
      // swiperList: [
      //   {
      //     id: 1,
      //     imgUrl:
      //       "http://112.74.81.230:3000/upload_7d0b10bc8f28d99c130b8ed57ee5f9de.jpeg",
      //   },
      //   {
      //     id: 2,
      //     imgUrl:
      //       "	http://112.74.81.230:3000/upload_8ccce325d4ea88e69ed291c67d3acb29.jpeg",
      //   },
      //   {
      //     id: 3,
      //     imgUrl:
      //       "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg",
      //   },
      // ],
      swiperOption: {
        loop: true,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false,
        },
        // 显示分页
        pagination: {
          el: ".swiper-pagination",
          clickable: true, //允许分页点击跳转
        },
      },
    };
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
  },
};
</script>

<style scoped>
.swiper-wrap .swiper-container {
  position: relative;
  width: 100vm;
  height: 450px;
}
.swiper-wrap .swiper-container .swiper-slide {
  width: 100vm;
  line-height: 450px;
  color: #000;
  font-size: 16px;
  text-align: center;
}
.swiper-wrap .swiper-container .swiper-slide img {
  width: 100%;
  height: 100%;
}
</style>
