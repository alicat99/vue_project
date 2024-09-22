<template>
  <header>
      <div class="header">

        <a href="/" class="name font-title title-box">
          <img src="@/assets/icon.png" width="40px" height="40px"/>
          SOONGSIL<spen style="color: var(--p3);">.US</spen>
        </a>
        
        <button @click="linkToLogin" v-if="isInitiated && userData == null" class="login font-title">
          로그인
        </button>
      </div>
      <div style="height: 50px;"></div>
  </header>

</template>

<script setup>
import { ref, inject } from 'vue';
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

const $cookies = inject('$cookies');

auth.onAuthStateChanged((user) => {
  isInitiated.value = true;
  userData.value = user;
  if (user != null) {
    //user.getIdToken(true).then(token => {
    //  console.log(token);
    //  console.log($cookies.get('userHash'));
    //});

    if (!user.emailVerified) {
      const currentRoute = router.currentRoute.value.path;
      if (currentRoute != '/auth/verification' && currentRoute != '/auth/logout' && currentRoute != '/auth/register') {
        alert("이메일 인증을 완료해주세요");
        router.push({name: "Auth", params: {type: "verification"}});
      }
    }
  }
});
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