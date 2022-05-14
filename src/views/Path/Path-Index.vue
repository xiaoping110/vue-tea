<template>
  <div class="pathIndex-wrap">
    <Header :routerFlg="'other'"></Header>
    <section class="path-main">
      <ul v-if="list && list.length > 0">
        <li @click="goList(item)" v-for="item in list" :key="item.id">
          <div>
            <span>{{ item.name }}</span
            >&nbsp;
            <span>{{ item.tel }}</span>
          </div>
          <div>
            <span style="color: red" v-if="item.isDefault === '1'">
              [默认]&nbsp; </span
            ><span>{{ item.province }}</span
            >&nbsp; <span>{{ item.city }}</span
            >&nbsp;
            <span>{{ item.addressDetail }}</span>
          </div>
        </li>
      </ul>
      <h3 v-else>暂无地址信息，请添加... ...</h3>
      <div class="add_address" @click="goList('add')">添加地址</div>
    </section>
    <Tabbar />
  </div>
</template>

<script>
import Header from "@/components/path/Header";
import Tabbar from "@/components/common/Tabbar.vue";
import { mapState, mapMutations } from "vuex";
export default {
  name: "PathIndex",
  components: { Header, Tabbar },
  created() {
    this.getAddressData();
  },
  computed: {
    ...mapState({
      list: (state) => state.path.list,
    }),
  },
  methods: {
    ...mapMutations(["initData"]),
    async getAddressData() {
      let result = await this.$API.path.getAddress();
      if (!result.success) return;
      this.initData(result.data);
    },
    goList(option) {
      this.$router.push({
        name: "PathList",
        params: {
          key: JSON.stringify(option),
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.pathIndex-wrap {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .path-main {
    flex: 1;
    overflow: hidden;
    background: #f7f7f7;
    ul {
      li {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        margin: 12px 12px;
        background: #fff;
        padding: 6px 12px;
        height: 120px;
        box-sizing: border-box;
        font-size: 28px;
      }
    }

    .add_address {
      margin: 40px auto;
      width: 180px;
      color: #fff;
      background: #1296db;
      font-size: 28px;
      text-align: center;
      padding: 12px 12px;
      border-radius: 10px;
      font-weight: 500;
    }
  }
}
</style>
