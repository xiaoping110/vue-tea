import request from "@/utils/request";

export const getGoodsList = () => request.get("/api/goods/list");

export const getGoodsInfoById = (params) =>
  request({ url: "/api/goods/id", method: "get", params });

export const addGoodsToCart = (data) =>
  request({ url: "/api/addCart", method: "post", data });
