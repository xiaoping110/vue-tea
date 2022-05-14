<template>
  <div class="search-wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Search",
  components: {},
};
</script>

<style lang="less" scoped>
.search-wrap {
  display: felx;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
  .search-main {
    flex: 1;
    overflow: hidden;
    .searchTitle {
      font-size: 32px;
      font-weight: 500;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      i {
        font-size: 32px;
        color: red;
        font-weight: 500;
      }
      .remove {
        font-size: 26px;
      }
    }
    .search-history {
      padding: 20px;
      ul {
        display: flex;
        flex-wrap: wrap;
        li {
          font-size: 32px;
          border: 1px solid #ccc;
          padding: 6px 12px;
          margin: 10px 10px 10px 0;
          border-radius: 6px;
        }
      }
    }
  }
}
</style>
