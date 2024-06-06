<template>
  <header>
      <div class="header">
        <a href="/" class="name">
          SOONGSIL<spen class="highlight">.US</spen>
        </a>
      </div>
      <div class="placeholder"></div>
  </header>

</template>

<script setup>

</script>

<style>
.placeholder {
  height: 50px;
}
.header {
  font-family: 'Black Han Sans';
  position: fixed;
  background-color: var(--p1);
  width: 100%;
  height: 30px;
  display: flex;
  align-items: center;
  padding: 10px;
}
.name {
  color: var(--b1);
  font-size: 20px;
  text-align: left;
  text-decoration-line: none;
}
.highlight {
  color: var(--p3);
}
</style>