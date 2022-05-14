<template>
  <div class="search-index-wrap">
    <Header></Header>
    <section class="search-main">
      <div class="search-history" v-if="searchArr && searchArr.length">
        <h2 class="searchTitle">
          <span>
            <i class="iconfont icon-shijian"></i>
            <span>历史搜索</span>
          </span>
          <span class="remove" @click="removeSearchArr">清空历史记录</span>
        </h2>
        <ul>
          <li
            v-for="(item, index) in searchArr"
            :key="index"
            @click="goSearchList(item)"
          >
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else>暂无搜索记录...</div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/search/header.vue"
import Tabbar from "@/components/common/Tabbar.vue"
import { MessageBox } from "mint-ui"
export default {
  name: "Search",
  data() {
    return {
      searchArr: [],
    }
  },
  components: { Header, Tabbar },
  created() {
    this.searchArr = JSON.parse(localStorage.getItem("searchList"))
  },
  methods: {
    removeSearchArr() {
      MessageBox({
        title: "提示",
        message: "确认删除搜索记录?",
        showCancelButton: true,
      }).then((res) => {
        if (res === "confirm") {
          localStorage.removeItem("searchList")
          this.searchArr = []
        }
      })
    },
    goSearchList(item) {
      this.$router.push({
        name: "SearchList",
        query: {
          key: item,
        },
      })
    },
  },
}
</script>

<style lang="less" scoped>
.search-index-wrap {
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
