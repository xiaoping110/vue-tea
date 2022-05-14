<template>
  <div class="search-list-wrap">
    <div class="search-list-header">
      <Header></Header>
      <ul>
        <!-- <li>综合</li>
        <li>
          <div>价格</div>
          <div class="search-filter">
            <i class="iconfont icon-arrow_up_fat"></i>
            <i class="iconfont icon-arrow_down_fat"></i>
          </div>
        </li>
        <li>
          <div>销量</div>
          <div class="search-filter">
            <i class="iconfont icon-arrow_up_fat"></i>
            <i class="iconfont icon-arrow_down_fat"></i>
          </div>
        </li> -->
        <li
          v-for="(item, index) in searchList.data"
          :key="index"
          @click="changeTab(index)"
        >
          <div :class="index === searchList.currentIndex ? 'active' : ''">
            {{ item.name }}
          </div>
          <div class="search-filter" v-if="index !== 0">
            <i
              class="iconfont icon-arrow_up_fat"
              :class="item.status === 1 ? 'active' : ''"
            ></i>
            <i
              class="iconfont icon-arrow_down_fat"
              :class="item.status === 2 ? 'active' : ''"
            ></i>
          </div>
        </li>
      </ul>
    </div>
    <section class="search-list-main">
      <ul v-if="goodsList && goodsList.length">
        <li v-for="goods in goodsList" :key="goods.id">
          <img :src="goods.imgUrl" alt="" srcset="" />
          <h3 class="title">{{ goods.name }}</h3>
          <div class="price">
            <div>
              <span>￥</span>
              <b>{{ goods.price }}</b>
            </div>
            <div>立即购买</div>
          </div>
        </li>
      </ul>
      <h1 v-else>暂无数据... ...</h1>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from "@/components/search/header";
import Tabbar from "@/components/common/Tabbar";
export default {
  name: "SearchList",
  components: { Header, Tabbar },
  data() {
    return {
      goodsList: [],
      searchList: {
        currentIndex: 0,
        data: [
          {
            name: "综合",
            key: "zh",
          },
          {
            name: "价格",
            status: 0,
            key: "price",
          },
          {
            name: "销量",
            status: 0,
            key: "num",
          },
        ],
      },
    };
  },
  created() {
    this.getData();
  },
  computed: {
    orderBy() {
      let obj = this.searchList.data[this.searchList.currentIndex];
      let val = obj.status === 1 ? "asc" : "desc";
      return {
        [obj.key]: val,
      };
    },
  },
  methods: {
    async getData() {
      const searchName = this.$route.query.key;
      const res = await this.$API.search.getGoodsList({
        searchName,
        ...this.orderBy,
      });
      this.goodsList = res.data;
    },
    changeTab(index) {
      this.searchList.currentIndex = index;

      let item = this.searchList.data[index];
      this.searchList.data.forEach((v, i) => {
        if (i !== index) {
          v.status = 0;
        }
      });

      if (index === this.searchList.currentIndex) {
        item.status = item.status === 1 ? 2 : 1;
      }
      this.getData();
    },
  },
  watch: {
    $route() {
      this.getData();
    },
  },
};
</script>

<style lang="less" scoped>
.search-list-wrap {
  display: flex;
  flex-direction: column;
  width: 100vm;
  height: 100vh;
  overflow: hidden;
  .search-list-header {
    ul {
      display: flex;
      justify-content: space-around;
      padding: 20px 0;
      font-size: 28px;
      li {
        display: flex;
        .active {
          color: red;
        }
        .search-filter {
          margin-left: 6px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          i:nth-child(2) {
            margin-top: -8px;
          }
        }
      }
    }
  }
  .search-list-main {
    flex: 1;
    overflow: hidden;
    ul {
      display: flex;
      flex-wrap: wrap;
      margin: 14px;
      li {
        width: 50%;
        padding: 14px;
        box-sizing: border-box;
        img {
          width: 340px;
          height: 340px;
          border-radius: 10px;
        }
        .title {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 28px;
          color: #222;
        }
        .price {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          font-size: 26px;
          margin-top: 10px;
          & > div:first-child {
            color: red;
            b {
              font-size: 30px;
              margin-left: -6px;
            }
          }
          & > div:last-child {
            color: #fff;
            background: #b0353f;
            padding: 6px 12px;
            border-radius: 12px;
          }
        }
      }
    }
  }
}
</style>
