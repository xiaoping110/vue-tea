<template>
  <div class="card-wrap">
    <div class="title">
      <h1>
        <slot name="tie"></slot>
      </h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "Card",
};
</script>

<style scoped>
.title {
  width: 100%;
  padding: 20px 0;
  font-size: 32px;
  text-align: center;
  background: hsl(196, 34%, 74%, 0.1);
}
.title h1 {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title h1 span {
  margin: 0 20px;
  font-size: 28px;
  color: #1296db;
}
.title h1::after {
  width: 16px;
  height: 16px;
  content: "";
  border-radius: 50%;
  display: block;
  background: #1296db;
}

.title h1::before {
  width: 16px;
  height: 16px;
  content: "";
  border-radius: 50%;
  display: block;
  background: #1296db;
}
</style>
