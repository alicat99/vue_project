<template>
<div class="login-container">
  <img src="@/assets/logo_ic.svg">
  <h1 class="font-light">안녕하세요!
  <br><span class="font-bold">숭실고</span> 리로스쿨입니다.</h1>
  <p>soongsil.us와<br>성적 데이터를 공유합니다</p>

  <input id="riroId" type="text" v-model="id" placeholder="학교 아이디 또는 통합 아이디(이메일)" autocomplete="false">
  <input id="riroPw" type="password" v-model="pw" placeholder="비밀번호" autocomplete="new-password">

  <button class="login-btn" @click="submit" :class="{ 'disabled': !buttonEnable, 'enabled': buttonEnable }">로그인</button>
</div>
<div class="fixed-bg"></div>
</template>

<script setup>
import { inject, ref } from 'vue';
import { useRouter } from 'vue-router';

const id = ref('');
const pw = ref('');

const $cookies = inject('$cookies');
const router = useRouter();

const buttonEnable = ref(true);

async function submit() {
  if (!buttonEnable.value) {
    return;
  }
  buttonEnable.value = false;

  const uid = userData.value.uid;
  const userHash = $cookies.get('userHash');

  const body = `${uid} ${id.value} ${pw.value} ${userHash}`
  
  let data;
  const url = 'https://6tguzdsjjco4i52lstpyjrp3pu0dfokt.lambda-url.ap-northeast-2.on.aws/';
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: body,
    });

    data = await response.text();
    if (!response.ok) {
      if (response.status == 400) {
        alert(data);
      }
      else {
        alert('오류가 발생했습니다. 아이디나 비밀번호를 확인해 주세요.');
      }

      buttonEnable.value = true;
      return;
    }
  } catch (error) {
    alert('오류가 발생했습니다. 아이디나 비밀번호를 확인해 주세요.');
    buttonEnable.value = true;
    return;
  }
  buttonEnable.value = true;
  alert('로그인에 성공하였습니다. 성적 데이터가 입력되었습니다.');
  router.push({name: "Upload"});
}


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const auth = firebase.auth();

const userData = ref(null);
const isInitiated = ref(false);

auth.onAuthStateChanged(async (user) => {
  userData.value = user;
  isInitiated.value = true;

  console.log(user.uid);
});
</script>

<style>
.login-container {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
  width: 300px;
  text-align: center;
  margin: 0 auto;
  margin-top: 50px;
}
.login-container h1 {
  font-size: 24px;
  margin-bottom: 10px;
}
.login-container p {
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
}
.login-container input {
  width: calc(100% - 20px);
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.login-container .login-btn {
  color: white;
  border: none;
  padding: 10px;
  width: 100%;
  border-radius: 5px;
  cursor: pointer;
}
.enabled {
  background-color: #009CE5;
}
.disabled {
  background-color: gray;
}
.font-light {
  font-family: 'Pretendard';
  font-weight: 400;
}
.font-bold {
  font-family: 'Pretendard';
  font-weight: 800;
}
.fixed-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 200%;

  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  background-color: white;

  z-index: -1;
}
</style>