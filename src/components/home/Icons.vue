<template>
  <div class="icons-wrap">
    <ul class="icons">
      <li v-for="item in iconsList" :key="item.id" class="icons-item">
        <img :src="item.imgUrl" />
        <span>{{ item.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Icons",
  props: {
    iconsList: Array,
  },
  data() {
    return {
      // iconsList: [
      //   {
      //     id: 1,
      //     title: "自饮茶",
      //     imgUrl: "http://112.74.81.230/icons/nvpu.png",
      //   },
      //   {
      //     id: 2,
      //     title: "冰红茶",
      //     imgUrl: "http://112.74.81.230/icons/nvpu.png",
      //   },
      //   {
      //     id: 3,
      //     title: "绿茶",
      //     imgUrl: "http://112.74.81.230/icons/nvpu.png",
      //   },
      //   {
      //     id: 4,
      //     title: "茶礼盒",
      //     imgUrl: "http://112.74.81.230/icons/nvpu.png",
      //   },
      //   {
      //     id: 5,
      //     title: "官方验证",
      //     imgUrl: "http://112.74.81.230/icons/nvpu.png",
      //   },
      // ],
    };
  },
};
</script>

<style scoped>
.icons-wrap .icons {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 150px;
  box-sizing: border-box;
}
.icons-wrap .icons .icons-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.icons-wrap .icons .icons-item img {
  width: 60px;
  height: 60px;
}
.icons-wrap .icons .icons-item span {
  font-size: 27px;
}
</style>
