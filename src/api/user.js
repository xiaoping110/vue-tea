import request from "@/utils/request";

export const login = (data) =>
  request({ url: "/api/login", method: "post", data });

export const getCode = (data) =>
  request({ url: "/api/code", method: "post", data });

export const addUser = (data) =>
  request({ url: "/api/insertuser", method: "post", data });

export const register = (data) =>
  request({ url: "/api/register", method: "post", data });
