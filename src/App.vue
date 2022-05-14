<template>
  <div id="app">
    <!-- <keep-alive>
      <router-view />
    </keep-alive> -->

    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<style>
html,
body {
  width: 100vw;
  height: 100vh;
}

.cancelButton {
  background: #959595 !important;
  width: 1.6rem !important;
  height: 0.6rem;
  color: #fff !important;
  border-radius: 0.05rem;
  border: none;
  margin: 0.2rem !important;
}
.confirmButton {
  background: #d9534f !important;
  width: 1.6rem !important;
  height: 0.6rem;
  color: #fff !important;
  border-radius: 0.05rem;
  border: none;
  margin: 0.2rem !important;
}
</style>
