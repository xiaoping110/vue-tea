<template>
  <header>
    <div class="search-return" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false" @keyup.enter="goSearchList">
        <input
          type="search"
          v-model="searchVal"
          placeholder="请输入搜索内容..."
        />
      </form>
    </div>
    <div class="search-btn" @click="goSearchList">搜索</div>
  </header>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {
      searchVal: this.$route.query.key || "",
      searchArr: [],
    };
  },
  methods: {
    goBack() {
      this.$router.back();
    },
    goSearchList() {
      if (!this.searchVal.trim()) return;

      if (!localStorage.getItem("searchList")) {
        localStorage.setItem("searchList", "[]");
      } else {
        this.searchArr = JSON.parse(localStorage.getItem("searchList"));
      }

      this.searchArr.unshift(this.searchVal.trim());
      let newArr = new Set(this.searchArr);
      localStorage.setItem("searchList", JSON.stringify(Array.from(newArr)));
      if (this.searchVal.trim() === this.$route.query.key) return;
      this.$router.push({
        name: "SearchList",
        query: {
          key: this.searchVal.trim(),
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 88px;
  background: #1296db;
  box-sizing: border-box;
  padding: 0 20px;
  .search-return {
    i {
      font-size: 48px;
      color: #fff;
    }
  }
  .search-main {
    display: flex;
    align-items: center;
    width: 494px;
    height: 60px;
    border-radius: 24px;
    background: #fff;
    padding: 10px;
    box-sizing: border-box;
    form {
      display: flex;
      height: 100%;
      width: 100%;
      input {
        outline: none;
        border: none;
        height: 100%;
        width: 100%;
        margin-left: 5px;
        font-size: 28px;
        &:focus {
          border: none;
        }
      }
    }
  }
  .search-btn {
    font-size: 32px;
    color: #fff;
  }
}
</style>
