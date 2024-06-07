<template>
  <div id="app">
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
  font-family: 'Pretendard-Regular';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

@import url('https://fonts.googleapis.com/css?family=Black+Han+Sans:400');

@font-face {
    font-family: 'Pretendard-Regular';
    src: url('https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
}
</style>
