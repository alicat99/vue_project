<template>
  <header>
      <div class="header">
        <a href="/" class="name font-title title-box">
          <img src="@/assets/icon.png" width="40px" height="40px"/>
          SOONGSIL<spen class="highlight">.US</spen>
        </a>
        <button @click="linkToLogin" v-if="isInitiated && userData == null" class="login font-title">
          로그인
        </button>
      </div>
      <div class="placeholder"></div>
  </header>

</template>

<script setup>
import { ref, onMounted } from 'vue';
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
  user.getIdToken(true).then(token => console.log(token));
  });
</script>

<style scoped>
.placeholder {
  height: 50px;
}
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
.login {
  background-color: transparent;
  border: none;
  padding: 5px 10px;
  color: var(--p3);
  font-size: 18px;
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