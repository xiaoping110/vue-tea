import request from "@/utils/request";

export const addAddress = (data) =>
  request({ url: "/api/insertAddress", method: "post", data });

export const getAddress = () =>
  request({ url: "/api/selectAddress", method: "post" });

export const uodateAddress = (data) =>
  request({ url: "/api/updateAddress", method: "post", data });

export const deleteAddress = (id) =>
  request({ url: "/api/deleteAddress", method: "get", params: { id } });
