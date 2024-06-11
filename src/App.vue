<template>
  <div id="app" class="font-main">
    <HeaderView></HeaderView>
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script setup>
import HeaderView from './components/HeaderView.vue'
</script>

<style>
:root {
  --b1: #FFF7FC;
  --b2: #f8dbed;
  --b3: #f7bee1;
  --b4: #e399c7;
  --p1: #8B93FF;
  --p2: #5755FE;
  --p3: #282785;
}

body {
  margin: 0px;
  background-color: var(--b1);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

.font-main {
  font-family: 'Pretendard';
  font-weight: 400;
}

.font-title {
  font-family: 'Pretendard';
  font-weight: 900;
}

@import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css");
</style>