import request from "@/utils/request";

export const getCartList = () =>
  request({ url: "/api/selectCart", method: "post" });

export const deleteCart = (arrId) =>
  request({ url: "/api/deleteCart", method: "post", data: { arrId } });

export const updateNum = (id, num) =>
  request({ url: "/api/updateNum", method: "post", data: { id, num } });

export const addOrder = (arr) =>
  request({ url: "/api/addOrder", method: "post", data: { arr } });

export const submitOrder = (data) =>
  request({ url: "/api/submitOrder", method: "post", data });

export const payMent = (data) =>
  request({ url: "/api/payMent", method: "post", data: { data } });

export const successPayment = (data) =>
  request({ url: "/api/successPayment", method: "post", data: { data } });
