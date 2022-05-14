import request from "@/utils/request";

export const getCartList = () =>
  request({ url: "/api/selectCart", method: "post" });

export const deleteCart = (arrId) =>
  request({ url: "/api/deleteCart", method: "post", data: { arrId } });

export const updateNum = (id, num) =>
  request({ url: "/api/updateNum", method: "post", data: { id, num } });
