const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");
const path = require("path");

module.exports = {
  devServer: {
    port: 8088,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        pathRewrite: { "^/api": "/api" },
      },
    },
  },
  configureWebpack: (config) => {
    config.resolve = {
      extensions: [".js", ".json", ".vue"],
      alias: {
        "@": path.join(__dirname, "./src"),
      },
    };
  },
  css: {
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 75,
            propList: ["*"],
            selectorBlackList: ["mint-", "van-"],
          }),
        ],
      },
    },
  },
};
