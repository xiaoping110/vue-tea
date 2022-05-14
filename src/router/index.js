import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/list",
    name: "List",
    component: () => import("../views/List.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    meta: {
      login: true,
    },
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/my",
    name: "My",
    component: () => import("../views/My.vue"),
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/Login.vue"),
  },
  {
    path: "/userlogin",
    name: "UserLogin",
    component: () => import("../views/Login/UserLogin.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Login/Register.vue"),
  },
  {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
    children: [
      {
        path: "/",
        name: "index",
        component: () => import("../views/Search/Search-index.vue"),
      },
      {
        path: "list",
        name: "SearchList",
        component: () => import("../views/Search/Search-List.vue"),
      },
    ],
  },
  {
    path: "/detail",
    name: "Detail",
    meata: {
      keepAlive: true,
    },
    component: () => import("../views/Detail.vue"),
  },
  {
    path: "/order",
    name: "Order",
    meata: {
      keepAlive: true,
    },
    component: () => import("../views/Order.vue"),
  },
  {
    path: "/path",
    name: "Path",
    component: () => import("../views/Path.vue"),
    children: [
      {
        path: "/",
        name: "PathIndex",
        component: () => import("../views/Path/Path-Index.vue"),
      },
      {
        path: "/pathlist",
        name: "PathList",
        component: () => import("../views/Path/Path-List.vue"),
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

const VueRouterPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(to) {
  return VueRouterPush.call(this, to).catch((err) => err);
};
export default router;
