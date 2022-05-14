<template>
  <div class="order-wrap">
    <header class="order-header">
      <i class="iconfont icon-fanhui" @click="$router.back()"></i>
      <span>我的地址</span>
      <i class="iconfont icon-kefu"></i>
    </header>
    <section class="order-content">
      <div class="path">
        <h3 class="path-title">收货信息：</h3>
        <div class="path-info">
          <div>
            <span>{{ path.name }}</span>
            <span>{{ path.tel }}</span>
          </div>
          <div>
            <span> 省:{{ path.province }}</span>
            <span> 市:{{ path.city }}</span>
            <span> 区:{{ path.county }}</span>
            <span> 详细地址:{{ path.addressDetail }}</span>
          </div>
        </div>
      </div>
      <div class="payment">
        <div class="payment-title">支付方式：</div>
        <van-radio-group class="payment-content" v-model="radioPayment">
          <van-radio name="1">微信支付</van-radio>
          <van-radio name="2">支付宝支付</van-radio>
        </van-radio-group>
      </div>
      <div class="goods">
        <ul>
          <li v-for="item in goodsList" :key="item.id">
            <div>
              <img :src="item.goods_imgUrl" />
            </div>
            <div class="goods-content">
              <h4>{{ item.goods_name }}</h4>
              <div class="goods-price">
                <span style="color: red">￥{{ item.goods_price }} </span>
                <span>X {{ item.goods_num }}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <footer class="order-footer">
      <div class="left">
        <span>共</span>
        <b>{{ total.num }}</b>
        <span>件，</span>
        <span>总金额:</span>
        <em>￥{{ total.price }}</em>
      </div>
      <div class="right">提交订单</div>
    </footer>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapState } from "vuex";
export default {
  name: "Order",
  data() {
    return {
      radioPayment: "1",
      path: {},
      items: [],
    };
  },
  created() {
    this.getAddress();
    this.items = JSON.parse(this.$route.query.detail);
  },
  computed: {
    ...mapGetters(["total", "defaultPath"]),
    ...mapState({
      list: (state) => state.cart.list,
    }),
    goodsList() {
      return this.items.map((id) => {
        return this.list.find((v2) => id === v2.id);
      });
    },
  },
  methods: {
    ...mapMutations(["initData"]),
    async getAddress() {
      let result = await this.$API.path.getAddress();
      if (!result.success) return;
      this.initData(result.data);

      this.path = this.defaultPath[0] || result.data[0];
    },
  },
};
</script>

<style lang="less" scoped>
.order-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f7f7f7;
  .order-header {
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

  .order-content {
    flex: 1;
    overflow: hidden;
    .path {
      .path-title {
        padding: 12px 20px;
        font-size: 32px;
        font-weight: 600;
      }
      .path-info {
        padding: 12px 20px;
        font-size: 28px;
        background: #fff;
      }
    }
    .payment {
      margin-top: 20px;
      background: #fff;
      .payment-title {
        padding: 12px 20px;
        font-size: 32px;
        font-weight: 600;
      }
      .payment-content {
        display: flex;
        padding: 12px 20px;
        .van-radio {
          margin-right: 12px;
          font-size: 14px;
          ::v-deep .van-radio__icon--round {
            line-height: 20px;
            font-size: 14px;
          }

          ::v-deep .van-radio__label {
            vertical-align: middle;
          }
        }
      }
    }
    .goods {
      background: #fff;
      ul {
        li {
          display: flex;
          padding: 20px;
          margin-top: 20px;
          box-sizing: border-box;
          font-size: 28px;
          img {
            width: 148px;
            height: 148px;
            vertical-align: middle;
            margin-right: 20px;
          }

          .goods-content {
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: space-between;
            .goods-price {
              display: flex;
              justify-content: space-between;
            }
          }
        }
      }
    }
  }
  .order-footer {
    display: flex;
    justify-content: space-between;
    height: 100px;
    border-top: 1px solid #eee;
    box-sizing: border-box;
    font-size: 28px;
    line-height: 98px;
    background: #fff;
    .left {
      padding: 0 12px;
      flex: 1;
      b,
      em {
        color: #b0352f;
      }
      em {
        font-size: 32px;
      }
    }
    .right {
      width: 200px;
      font-size: 40px;
      background: #1296db;
      line-height: 98px;
      text-align: center;
    }
  }
}
</style>
