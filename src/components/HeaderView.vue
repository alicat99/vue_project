<template>
  <header>
      <div class="header">
        <a href="/" class="name">
          SOONGSIL<spen class="highlight">.US</spen>
        </a>
        <button @click="linkToLogin" v-if="isInitiated && userData == null">
          로그인
        </button>
      </div>
      <div class="placeholder"></div>
  </header>

</template>

<script setup>
import { ref } from 'vue';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useRouter } from 'vue-router';

const router = useRouter();

function linkToLogin() {
  router.push({name: "Auth", params: {type: "login"}});
}

const auth = firebase.auth();

const userData = ref(null);
const isInitiated = ref(false);

auth.onAuthStateChanged((user) => {
  isInitiated.value = true;
  userData.value = user;
  });
</script>

<style scoped>
.placeholder {
  height: 50px;
}
.header {
  font-family: 'Black Han Sans';
  position: fixed;
  background-color: var(--p1);
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
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
button {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  color: var(--p3);
  font-size: 18px;
  font-family: "Black Han Sans";
}
</style>