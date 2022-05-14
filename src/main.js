import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "@/assets/css/common.css";
import "amfe-flexible"; //处理px 自动转换rem
// import "./assets/js/flexible.js";//处理px 自动转换rem
import "@/assets/css/iconfont.css";
import LyTab from "ly-tab";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import Vant from "vant";
import "vant/lib/index.css";
import "amfe-flexible/index.js";
import Mint from "mint-ui";
import "mint-ui/lib/style.css";
import API from "@/api";
Vue.config.productionTip = false;
Vue.use(Vant);
Vue.use(LyTab);
Vue.use(VueAwesomeSwiper);
Vue.use(Mint);

Vue.prototype.$API = API;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
