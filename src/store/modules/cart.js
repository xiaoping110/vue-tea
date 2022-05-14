import {
  CART_LIST,
  CHECK_ALL,
  UNCHECK_ALL,
  CHECK_ITEM,
} from "../mutations-types";
import { Toast, Dialog } from "vant";
export default {
  state: {
    list: [],
    selectList: [],
  },
  getters: {
    isCheckedALL(state) {
      return state.list.length === state.selectList.length;
    },
    total(state) {
      let total = {
        num: 0,
        price: 0,
      };

      state.list.forEach((item) => {
        if (item.checked) {
          total.num += parseInt(item.goods_num);
          total.price += item.goods_price * item.goods_num;
        }
      });
      return total;
    },
  },
  mutations: {
    [CART_LIST](state, cartArr) {
      state.selectList = [];
      state.list = cartArr;
      cartArr.forEach((item) => {
        state.selectList.push(item.id);
      });
    },
    [CHECK_ALL](state) {
      state.selectList = state.list.map((item) => {
        item.checked = true;
        return item.id;
      });
    },
    [UNCHECK_ALL](state) {
      state.list.map((item) => {
        item.checked = false;
        return item.id;
      });
      state.selectList = [];
    },
    [CHECK_ITEM](state, id) {
      let i = state.selectList.indexOf(id);
      if (i > -1) {
        return state.selectList.splice(i, 1);
      } else {
        state.selectList.push(id);
      }
    },
    delGoods(state) {
      state.list = state.list.filter((item) => {
        return state.selectList.indexOf(item.id) == -1;
      });
    },
  },
  actions: {
    checkAllFn({ commit, getters }) {
      getters.isCheckedALL ? commit("unCheckAll") : commit("checkAll");
    },
    delGoodsFn({ commit, state }, id) {
      if (!state.selectList.length) {
        Toast("请选择商品...");
        return;
      }
      let arrCart = [];
      Dialog.confirm({
        message: "确定要删除这些商品吗？",
      }).then(async () => {
        if (typeof id === "number") {
          arrCart = [id];
          let index = state.list.findIndex((item) => {
            return (item.id = id);
          });
          state.list.splice(index, 1);
        } else {
          arrCart = state.selectList;
          commit("delGoods");
          commit("unCheckAll");
        }

        let result = await this._vm.$API.cart.deleteCart(arrCart);

        if (result.success) {
          Toast(result.message);
        }
      });
    },
  },
};
