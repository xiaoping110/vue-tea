import { USER_LOGIN, USER_LOGOUT } from "../mutations-types";

export default {
  state: {
    loginStatus: false,
    token: null,
    userInfo: {},
  },
  getters: {},
  mutations: {
    [USER_LOGIN](state, user) {
      state.loginStatus = true;
      state.token = user.token;
      state.userInfo = user;
    },
    [USER_LOGOUT](state) {
      state.loginStatus = false;
      state.token = "";
      state.userInfo = {};
    },
  },
  actions: {},
};
