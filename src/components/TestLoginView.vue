<template>
  <button @click="login">button</button>
</template>

<script setup>
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Firebase Auth 서비스 참조
const auth = firebase.auth();

function login() {
  const email = "alicat9912374@gmail.com";
  const password = "a1b2c3";
  console.log('login');

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // 로그인 성공
      const user = userCredential.user;

      // ID 토큰 가져오기
      user.getIdToken().then((idToken) => {
        console.log('ID 토큰:', idToken);
      });
    })
    .catch((error) => {
      // 로그인 실패
      console.error('로그인 오류:', error);
    });
}
</script>

<style>
</style>
