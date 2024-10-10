<template>
  <header>
      <div class="header">

        <a href="/" class="name font-title title-box">
          <img src="@/assets/icon.png" width="40px" height="40px"/>
          SOONGSIL<span style="color: var(--p3);">.US</span>
        </a>
      </div>
      <div style="height: 50px;"></div>
  </header>

</template>

<script setup>
</script>

<style scoped>
.header {
  position: fixed;
  background-color: var(--p1);
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 10px;
  z-index: 2;
}
.name {
  color: var(--b1);
  font-size: 20px;
  text-align: left;
  text-decoration-line: none;
}
.title-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
}
img {
  margin-right: 10px;
}
</style>