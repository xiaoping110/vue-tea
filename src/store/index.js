import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import createlogger from "vuex/dist/logger";

Vue.use(Vuex);

import user from "./modules/user";
import cart from "./modules/cart";
import path from "./modules/path";

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user,
    cart,
    path,
  },
  plugins: [
    createlogger(),
    createPersistedState({
      key: "$store",
    }),
  ],
});
