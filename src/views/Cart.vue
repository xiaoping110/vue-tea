<template>
  <div class="cart-wrap">
    <header class="cart-header">
      <i class="iconfont icon-fanhui" @click="$router.replace('/')"></i>
      <span class="center">购物车</span>
      <span
        class="right"
        @click="isNavBar"
        v-text="isNavStatus ? '完成' : '编辑'"
      ></span>
    </header>
    <section class="cart-main" v-if="cartListInfo && cartListInfo.length > 0">
      <div class="content">
        <div class="checked-title">
          <van-checkbox
            @click="checkAllFn"
            :value="isCheckedALL"
            icon-size="14px"
          ></van-checkbox>
          <span>商品</span>
        </div>
        <ul>
          <li class="goods-item" v-for="item in cartListInfo" :key="item.id">
            <div class="checked-item">
              <van-checkbox
                @click="checkItem(item.id)"
                v-model="item.checked"
                icon-size="14px"
              ></van-checkbox>
            </div>
            <h2>
              <img :src="item.goods_imgUrl" />
            </h2>
            <div class="goods-info">
              <div class="goods-title">
                <h3>
                  {{ item.goods_name }}
                </h3>
                <i
                  class="iconfont icon-lajitong"
                  @click="delGoodsFn(item.id)"
                ></i>
              </div>
              <div class="goods-price">
                <p style="color: red">
                  ￥{{ (item.goods_price * 1).toFixed(2) }}
                </p>
                <van-stepper
                  v-model="item.goods_num"
                  @change="changeNum($event, item)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <section class="cart-main" v-else>
      <h1>暂无订单，请添加...</h1>
    </section>
    <footer>
      <div class="footer-left">
        <div class="left">
          <van-checkbox
            @click="checkAllFn"
            :value="isCheckedALL"
            icon-size="14px"
          ></van-checkbox>
        </div>
        <div class="center" v-show="!isNavStatus">
          <div>
            <span
              >共有<span class="total-active">{{ total.num }}</span
              >件商品</span
            >
          </div>
          <div>
            <span>总计:</span>
            <span style="color: red"
              >￥{{ total.price.toFixed(2) }} + 0茶币</span
            >
          </div>
        </div>
      </div>
      <div class="right" v-if="isNavStatus" @click="delGoodsFn">删除</div>
      <div class="right" v-else @click="goOrder">去结算</div>
    </footer>
  </div>
</template>

<script>
import { Toast } from "vant";
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "Cart",
  data() {
    return {
      checked: true,
      isNavStatus: false,
    };
  },
  created() {
    this.getCartList();
  },
  computed: {
    ...mapState({
      cartListInfo: (state) => state.cart.list,
      selectList: (state) => state.cart.selectList,
    }),
    ...mapGetters(["isCheckedALL", "total"]),
  },
  methods: {
    ...mapMutations(["cartList", "checkItem"]),
    ...mapActions(["checkAllFn", "delGoodsFn"]),
    async getCartList() {
      const result = await this.$API.cart.getCartList();
      result.data.forEach((item) => {
        item["checked"] = true;
      });
      this.cartList(result.data);
    },
    isNavBar() {
      this.isNavStatus = !this.isNavStatus;
    },
    async changeNum(value, item) {
      await this.$API.cart.updateNum(item.id, value);
    },
    goOrder() {
      if (!this.selectList.length) {
        Toast("请选择商品后提交！！！");
        return;
      }
      this.$router.push({
        path: "/order",
        query: {
          detail: JSON.stringify(this.selectList),
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.cart-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    background: #1296db;
    height: 88px;
    color: #fff;
    i {
      font-size: 48px;
    }
    .center {
      font-size: 40px;
    }
    .right {
      font-size: 38px;
    }
  }
  .cart-main {
    flex: 1;
    overflow: hidden;
    height: 100%;
    background: #f5f5f5;
    padding: 20px;

    .content {
      .checked-title {
        display: flex;

        span {
          font-size: 32px;
          font-weight: 600;
          padding: 0 10px;
        }
      }
      ul {
        display: flex;
        flex-direction: column;
        .goods-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #fff;
          padding: 20px 10px;
          margin-top: 20px;
          h2 {
            margin: 0 20px;
            img {
              width: 148px;
              height: 148px;
              vertical-align: middle;
            }
          }
          .goods-info {
            display: flex;
            flex-direction: column;
            flex: 1;
            font-size: 24px;
            height: 148px;

            .goods-title {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
              .icon-lajitong {
                margin: 20px;
                font-size: 30px;
              }
            }
            .goods-price {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }

  footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    width: 100%;
    bottom: 0px;
    left: 0px;
    height: 100px;
    border-top: 1px solid #eee;
    background: #fff;
    z-index: 999;
    padding: 0 0 0 20px;
    box-sizing: border-box;
    .footer-left {
      display: flex;
      flex: 1;
      align-items: center;
      .left {
        margin-right: 20px;
      }

      .center {
        display: flex;
        flex-direction: column;
        font-size: 28px;
        .total-active {
          color: #b20000;
        }
      }
    }
    .right {
      color: #fff;
      background: #1296db;
      width: 240px;
      line-height: 100px;
      text-align: center;
      height: 100px;
      box-sizing: border-box;
      border-top: 1px solid #eee;
    }
  }
}
</style>
