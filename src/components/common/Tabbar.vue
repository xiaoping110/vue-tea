<template>
  <div class="tabbar">
    <ul>
      <li
        v-for="(item, index) in routerList"
        :key="index"
        @click="switchTab(item.path)"
      >
        <img
          :src="$route.path.includes(item.path) ? item.selected : item.active"
        />
        <span :class="$route.path.includes(item.path) ? 'active' : ''">{{
          item.title
        }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Tabbar",
  data() {
    return {
      routerList: [
        {
          title: "首页",
          path: "/home",
          active: "http://112.74.81.230/icons/home.png",
          selected: "http://112.74.81.230/icons/home-select.png",
        },
        {
          title: "分类",
          path: "/list",
          active: "http://112.74.81.230/icons/sort.png",
          selected: "http://112.74.81.230/icons/sort-select.png",
        },
        {
          title: "购物车",
          path: "/cart",
          active: "http://112.74.81.230/icons/cart.png",
          selected: "http://112.74.81.230/icons/cart-select.png",
        },
        {
          title: "我的",
          path: "/my",
          active: "http://112.74.81.230/icons/user.png",
          selected: "http://112.74.81.230/icons/user-select.png",
        },
      ],
    };
  },
  methods: {
    switchTab(path) {
      if (this.$route.path === path) return;
      this.$router.replace(path);
    },
  },
};
</script>

<style scoped>
.tabbar {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100px;
  background: #fff;
  z-index: 999;
  border-top: 1px solid #f3f3f3;
}
.tabbar ul {
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: 100%;
}

.tabbar ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.tabbar ul li img {
  width: 40px;
  height: 40px;
}
.tabbar ul li span {
  font-size: 16px;
}
.active {
  color: #1296db;
}
</style>
