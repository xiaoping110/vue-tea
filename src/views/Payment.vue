<template>
  <div class="pay-wrap">
    <h2>{{ payStatus ? "支付成功..." : "支付失败..." }}</h2>
    <button @click="$router.replace('/')">返回首页</button>
  </div>
</template>

<script>
import qs from "qs";
export default {
  name: "Payment",
  data() {
    return {
      payStatus: false,
    };
  },
  created() {
    this.getData();
  },
  methods: {
    async getData() {
      //http://localhost:8088/payment?
      //charset=utf-8&out_trade_no=20220515110212989413&method=alipay.trade.page.pay.return&total_amount=58.00&sign=YIhOEbhmcjOfqODeRsl3XWok3UQbMHZTtpRFTmP7ZPtMOajgZQ%2FX5qusSoFgq0shOU28uQ5oM2qdEOlUbijTxn5%2B3pAz%2BxpSlnD4HB0725srXOKNufiGb3CTQEYXrdCx8GUUQZimlUcGMqb10vNdKPe2DXom6%2FV7XP6pEaOHl684LpxgnRjnjM0SlwRpOdT677ooupOX4pj4FPDYHHE2b%2Fo2h3hdzwXPPWXFJG06pGDphJuy5p5el%2F4KVmgWzsb6n4odXDk8KI2Y0XPUTx1uZlxm07MSEdXwJoBICASoY4P%2Fwfp4DCW9lZUp3xrKQp8AmXH8kTMSr%2FE7IJQRYlvW8w%3D%3D&trade_no=2022051522001445740505657552&auth_app_id=2021000119694637&version=1.0&app_id=2021000119694637&sign_type=RSA2&seller_id=2088621958713314&timestamp=2022-05-15%2011%3A02%3A47
      let data = qs.stringify({
        out_trade_no: this.$route.query.out_trade_no,
        trade_no: this.$route.query.trade_no,
      });
      const result = await this.$API.cart.successPayment(data);
      if (result.data.code === 2) {
        this.payStatus = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.pay-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100vw;
  height: 100vh;
  padding: 50px;
  box-sizing: border-box;
  background: #f7f7f7;
  button {
    background: #1296db;
    border-radius: 20px;
    color: #fff;
    border: 1px solid #ccc;
    padding: 6px;
  }
}
</style>
