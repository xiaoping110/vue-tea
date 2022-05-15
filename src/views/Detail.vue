<template>
  <div class="detail-wrap" ref="detailWrap">
    <header>
      <div class="header-return" v-if="isShow">
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <i class="iconfont icon-kefu"></i>
      </div>
      <div class="header-bar" v-else :style="styleOption">
        <i class="iconfont icon-fanhui" @click="goBack"></i>
        <div class="header-content">
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <i class="iconfont icon-kefu"></i>
      </div>
    </header>
    <section ref="wrapper" class="wrapper">
      <div class="content">
        <div class="swiper-wrap">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="item in swiperList" :key="item.id">
              <img :src="item.imgUrl" />
            </swiper-slide>

            <div class="swiper-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <div class="goods-name">
          <h1>{{ goods.name }}</h1>
          <div>揭开解开了揭开就尽量尽快了解了</div>
        </div>
        <div class="goods-price">
          <div class="nprice">
            <span>￥</span><b>{{ goods.price }}</b>
          </div>
          <div class="oprice">
            <span>价格：</span><del>￥{{ goods.price }}</del>
          </div>
        </div>
        <div class="test">
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
          <img :src="goods.imgUrl" />
        </div>
      </div>
    </section>

    <footer class="detail-footer">
      <div @click="addCart">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script>
//引入插件
import BetterScroll from "better-scroll";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { Toast } from "mint-ui";
import { mapMutations } from "vuex";
export default {
  name: "Detail",
  components: {
    swiper,
    swiperSlide,
  },
  data() {
    return {
      id: "",
      styleOption: {},
      isShow: true,
      betterScroll: "",
      swiperList: [
        {
          id: 1,
          imgUrl:
            "http://112.74.81.230:3000/upload_7d0b10bc8f28d99c130b8ed57ee5f9de.jpeg",
        },
        {
          id: 2,
          imgUrl:
            "	http://112.74.81.230:3000/upload_8ccce325d4ea88e69ed291c67d3acb29.jpeg",
        },
        {
          id: 3,
          imgUrl:
            "http://112.74.81.230:3000/upload_c7b17738df524ea4c1d70dcf9f3ab580.jpeg",
        },
      ],
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
          type: "fraction",
        },
      },
      goods: {},
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getData();
  },
  mounted() {},
  activated() {
    if (this.$route.query.id !== this.id) {
      this.id = this.$route.query.id;
      this.getData();
    }
  },
  methods: {
    ...mapMutations(["USER_LOGOUT"]),
    async addCart() {
      if (!this.$store.state.user.token) {
        this.$router.push("/login");
      }
      const result = await this.$API.list.addGoodsToCart({
        goodsId: this.$route.query.id,
      });

      if (result.success) {
        Toast("添加成功！！！");
      } else {
        if (result.data.code === 1000) {
          this.USER_LOGOUT();
          this.$router.push(`/login?redirect=detail?id=${this.id}`);
        }
      }
    },
    goBack() {
      this.$router.back();
    },
    async getData() {
      let id = this.$route.query.id;
      const result = await this.$API.list.getGoodsInfoById({ id });
      this.goods = result.data;
    },
  },
  watch: {
    goods() {
      this.$nextTick(() => {
        this.betterScroll = new BetterScroll(this.$refs.wrapper, {
          probeType: 3,
          bounce: false,
          click: true,
        });

        this.betterScroll.on("scroll", (pos) => {
          let posY = Math.abs(pos.y);
          let opacity = posY / 180;

          opacity = opacity > 1 ? 1 : opacity;

          this.styleOption = {
            opacity,
          };

          if (posY >= 50) {
            this.isShow = false;
          } else {
            this.isShow = true;
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail-wrap {
  display: flex;
  flex-direction: column;
  width: 100vm;
  height: 100vh;
  overflow: hidden;
  .test {
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    img {
      width: 100%;
    }
  }
  header {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    height: 88px;
    z-index: 999;

    .header-return {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 20px;
      i {
        font-size: 38px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        color: #fff;
        text-align: center;
        line-height: 60px;
        background: rgba(0, 0, 0, 0.3);
      }
    }
    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 100%;
      padding: 0 20px;
      background: #fff;
      color: rgba(0, 0, 0, 1);
      i {
        font-size: 38px;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
      }
      .header-content {
        display: flex;
        flex: 1;
        justify-content: center;
        span {
          margin: 0 20px;
          font-size: 32px;
        }
      }
    }
  }
  .wrapper {
    flex: 1;
    overflow: hidden;
    .content {
      padding-bottom: 100px;
      .goods-name {
        box-sizing: border-box;
        margin: 40px 20px 20px;
        border-bottom: 1px solid #ccc;
        h1 {
          font-size: 36px;
          font-weight: 500;
        }
        div {
          color: #999;
          font-size: 28px;
          margin: 6px 0;
        }
      }

      .goods-price {
        box-sizing: border-box;
        margin: 0px 20px;
        font-size: 32px;
        margin-bottom: 20px;
        .nprice {
          color: red;
          span {
            font-size: 24px;
          }
        }
        .oprice {
          color: #999;
          font-size: 24px;
        }
      }
    }
  }
  .detail-footer {
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 98px;
    background: yellow;
    border-top: 1px solid #ccc;
    div {
      width: 50%;
      font-size: 32px;
      text-align: center;
      line-height: 98px;
      color: #fff;
      background: #b20000;
      &:first-child {
        border-right: 1px solid #fff;
        background: #ff9500;
      }
    }
  }
}
</style>

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

.swiper-pagination {
  text-align: right;
  padding-right: 20px;
  color: #fff;
  font-size: 28px;
  border-radius: 10px;
  box-sizing: border-box;
}
</style>
