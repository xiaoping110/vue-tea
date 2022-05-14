import request from "@/utils/request";

export const getGoodsList = (params) =>
  request({
    url: "/api/goods/shopList",
    method: "get",
    params,
  });
