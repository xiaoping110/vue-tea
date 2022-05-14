<template>
  <div class="list-wrap">
    <header class="list-header" v-show="isShow">
      <div class="left">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="search">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜你喜欢的...</span>
      </div>
      <div class="right">
        <img src="http://112.74.81.230/icons/home.png" />
      </div>
    </header>
    <section class="list-main">
      <div class="list-l left-wrapper">
        <ul class="content">
          <li
            :class="index === selectCurrentId ? 'active' : ''"
            v-for="(item, index) in leftData"
            :key="index"
            @click="goScroll(index)"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
      <div class="list-r right-wrapper" ref="righWrapper">
        <div class="content">
          <div class="list-img" ref="listImg">
            <img
              src="http://112.74.81.230:3000/upload_8ccce325d4ea88e69ed291c67d3acb29.jpeg"
              alt=""
            />
          </div>
          <ul>
            <li class="shop-list" v-for="item in rightData" :key="item.id">
              <h2>—— {{ item.name }} ——</h2>
              <ul class="r-content">
                <li class="" v-for="v in item.list" :key="v.id">
                  <img :src="v.imgUrl" />
                  <span>{{ v.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from "../components/common/Tabbar.vue";

//引入插件
import BetterScroll from "better-scroll";

export default {
  name: "List",
  components: { Tabbar },
  data() {
    return {
      leftData: [],
      rightData: [],
      allHeight: [],
      scrollY: 0,
      isShow: true,
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const res = await this.$API.list.getGoodsList();
      const leftArr = [];
      const rightArr = [];

      res.data.forEach((v) => {
        leftArr.push({
          id: v.id,
          name: v.name,
        });
        rightArr.push(v.data);
      })
      this.leftData = leftArr;
      this.rightData = rightArr;
    },
    goScroll(index) {
      if (index === 0) {
        this.rightBScroll.scrollTo(0, 0, 500);
      } else {
        this.rightBScroll.scrollTo(0, -this.allHeight[index], 500);
      }
    },
  },
  computed: {
    selectCurrentId() {
      return this.allHeight.findIndex((item, index) => {
        return (
          (this.scrollY >= item || this.scrollY < 190) &&
          this.scrollY < this.allHeight[index + 1]
        );
      })
    },
  },
  watch: {
    leftData() {
      this.$nextTick(() => {
        new BetterScroll(".left-wrapper", {
          click: true,
        });
      })
    },
    rightData() {
      this.$nextTick(() => {
        this.rightBScroll = new BetterScroll(".right-wrapper", {
          probeType: 3,
          bounce: false,
          click: true,
        });
        let height = this.$refs.listImg.clientHeight;
        this.allHeight.push(height);
        let lis = this.$refs.righWrapper.getElementsByClassName("shop-list");
        Array.from(lis).forEach((v) => {
          height += v.clientHeight;
          this.allHeight.push(height);
        })

        this.rightBScroll.on("scroll", (pos) => {
          this.scrollY = Math.abs(pos.y);

          if (this.scrollY >= 50) {
            this.isShow = false;
          } else {
            this.isShow = true;
          }
        });
      })
    },
  },
};
</script>
<style lang="less" scoped>
.list-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  .list-header {
    display: flex;
    justify-content: space-between;
    height: 88px;
    padding: 0 20px;
    background: #1296db;
    color: #fff;
    align-items: center;
    .left {
      i {
        font-size: 48px;
      }
    }

    .search {
      flex: 1;
      margin: 0 30px;
      border-radius: 20px;
      background: #fff;
      color: #666;
      height: 54px;
      font-size: 28px;
      line-height: 54px;
      padding: 6px 12px;
      i {
        font-size: 28px;
        margin-right: 10px;
      }
    }
    .right {
      img {
        width: 36px;
        height: 36px;
      }
    }
  }
  .list-main {
    display: flex;
    flex: 1;
    overflow: hidden;

    .list-l {
      width: 186px;
      background: #fff;
      box-sizing: border-box;
      border-right: 1px solid #eee;
      margin-top: 20px;
      ul {
        li {
          width: 100%;
          text-align: center;
          font-size: 28px;
          height: 60px;
          line-height: 60px;
          box-sizing: border-box;
          &.active {
            border-left: 6px solid #1296db;
            color: #1296db;
          }
        }
      }
    }

    .list-r {
      flex: 1;
      overflow: hidden;
      .list-img {
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
        img {
          width: 100%;
        }
      }
      .content {
        padding-bottom: 100px;
        .shop-list {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 20px;
          h2 {
            font-size: 32px;
            opacity: 0.5;
          }
          .r-content {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;

            li {
              display: flex;
              flex-direction: column;
              align-items: center;
              box-sizing: border-box;
              width: 33%;
              padding: 20px 0;
              font-size: 28px;
              img {
                width: 106px;
                height: 106px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
