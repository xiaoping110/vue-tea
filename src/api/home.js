import request from "@/utils/request";
// const pre = "/mock";
// const pre='/api'

export const getShowInitInfo = () => request.get("/api/index_list/0/data/1");

export const getShowOtherInfo = (index) =>
  request.get(`/api/index_list/${index}/data/1`);
