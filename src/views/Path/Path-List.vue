<template>
  <div class="pathIndex-wrap">
    <Header :routerFlg="'one'">
      <span v-if="pathState">添加地址</span>
      <span v-else>编辑地址</span>
    </Header>
    <section class="path-main">
      <van-address-edit
        v-if="pathState"
        :area-list="areaList"
        show-set-default
        @save="onSave"
      />
      <van-address-edit
        v-else
        :address-info="AddressInfo"
        :area-list="areaList"
        show-delete
        show-set-default
        @save="onUpdate"
        @delete="onDelete"
      />
    </section>
    <Tabbar />
  </div>
</template>

<script>
import Header from "@/components/path/Header";
import Tabbar from "@/components/common/Tabbar.vue";
import { Toast } from "vant";
export default {
  name: "PathList",
  data() {
    return {
      pathState: false,
      AddressInfo: {},
      areaList: {
        province_list: {
          110000: "北京市",
          120000: "天津市",
        },
        city_list: {
          110100: "北京市",
          120100: "天津市",
        },
        county_list: {
          110101: "东城区",
          110102: "西城区",
        },
      },
    };
  },

  components: { Header, Tabbar },
  created() {
    let key = JSON.parse(this.$route.params.key);

    if (key === "add") {
      this.pathState = true;
    } else {
      this.pathState = false;
      key.isDefault = key.isDefault === "1" ? true : false;
      this.AddressInfo = key;
    }
  },
  methods: {
    async onSave(content) {
      content.isDefault = content.isDefault === true ? 1 : 0;
      let data = { ...content };
      const result = await this.$API.path.addAddress(data);

      if (result.success) {
        if (!result.success) return;
        Toast(result.message);
        this.$router.push("/path");
      }
    },
    async onUpdate(content) {
      content.isDefault = content.isDefault === true ? 1 : 0;
      const result = await this.$API.path.uodateAddress(content);
      if (result.success) {
        Toast(result.message);
        this.$router.push("/path");
      }
    },
    async onDelete(content) {
      const result = await this.$API.path.deleteAddress(content.id);
      if (result.success) {
        Toast(result.message);
        this.$router.push("/path");
      }
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

    .van-address-edit {
      padding: 0;
    }

    ::v-deep .van-button--danger {
      background: #1296db;
      border: 1px solid #ccc;
      border-radius: 10px;
      width: 300px;
      height: 40px;
      margin: 0 auto;
      box-sizing: border-box;
    }
    ::v-deep .van-button--default {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 10px;
      width: 300px;
      height: 40px;
      margin: 10px auto;
      box-sizing: border-box;
    }
  }
}
</style>
