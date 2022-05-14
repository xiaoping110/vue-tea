<template>
  <header class="header">
    <h1>
      <img src="http://112.74.81.230/img/logo.d429cde5.png" class="logo" />
    </h1>
    <div class="search">
      <input
        type="search"
        placeholder="🔍请输入搜索内容..."
        @click="goSearch"
      />
    </div>
    <div class="kefu">
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>
export default {
  name: "Header",
  methods: {
    goSearch() {
      this.$router.push("/search");
    },
  },
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  justify-items: center;
  height: 88px;
  box-sizing: border-box;
  background: #1296db;
}
.header h1 {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 20px;
}
.header h1 img {
  display: block;
  width: 60px;
  height: 60px;
}
.header .kefu {
  display: flex;
  height: 100%;
  align-items: center;
  padding: 0 20px;
}
.header .kefu i {
  font-size: 60px;
  color: #fff;
}
.search {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.search input[type="search"] {
  height: 60px;
  border-radius: 20px;
  outline: none;
  border: none;
  width: 90%;
  padding: 10px;
  font-size: 28px;
}
</style>
