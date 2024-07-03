<template>
  <div class="background">
    <div style="display: flex; align-items: center;" class="font-title logo fade-in">
      <img src="@/assets/icon.png" class="img-logo" width="80px" height="80px"/>
      <span>SOONGSIL<span class="highlight">.US</span></span>
    </div>

    <div style="font-size:20px; color:var(--b1); margin-top: 50px" class="fade-in">
      숭실고등학교의 기출문제 모음 사이트입니다
    </div>
    <div style="display: flex; align-items: center; color: white; font-size: 20px; margin-bottom: 30px;" class="fade-in">
      <img src="@/assets/dys.png" width="160px"/> X <span style="font-size: 40px; margin-left: 20px" class="font-title">PCL</span>
    </div>

    <ul>
      <div class="result-container fade-in">
        <div class="result-url">
          2023 1학기 기말고사 2학년 화학1
        </div>
        <span class="result-tag result-tag2">정답</span>
        <span class="result-tag result-tag1">문제</span>
      </div>
      <div class="result-container fade-in">
        <div class="result-url">
          2022 1학기 기말고사 2학년 화학1
        </div>
        <span class="result-tag result-tag2">정답</span>
        <span class="result-tag result-tag1">문제</span>
      </div>
      <div class="result-container fade-in">
        <div class="result-url">
          2021 1학기 기말고사 2학년 화학1
        </div>
        <span class="result-tag result-tag2">정답</span>
        <span class="result-tag result-tag1">문제</span>
      </div>
    </ul>
    
    <div style="font-size:20px; color:var(--b1); margin-bottom: 100px; margin-top:20px" class="fade-in">
      기출문제와 정답을 검색을 통해 쉽게 다운로드하세요!
    </div>

    <div class="title font-title fade-in">회원가입</div>

    <div class="input-container fade-in">
      <input placeholder="이메일을 입력하세요" id="username" v-model="email" class="email-input" />
      <span class="email-suffix">@soongsil.us</span>
    </div>

    <div>
      <input
        placeholder="비밀번호를 입력하세요"
        id="password"
        type="password"
        v-model="password"
        @keydown.enter="submit"
        class="input-password fade-in"
      />
    </div>

    <button :class="{ submit: true, 'fade-in':true, 'submit-loading': buttonDisable }" :disabled="buttonDisable" @click="submit">
      회원가입
    </button>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import CryptoJS from 'crypto-js';

const email = ref('');
const password = ref('');
const buttonDisable = ref(false);

const router = useRouter();

const auth = firebase.auth();

const $cookies = inject('$cookies');

async function signUp(email, password) {
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);
  const user = userCredential.user;
  return user
}

function getErrorMessage(errorCode) {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return '이미 사용 중인 이메일 주소입니다.';
      case 'auth/invalid-email':
        return '유효하지 않은 이메일 주소입니다.';
      case 'auth/operation-not-allowed':
        return '이 작업은 현재 허용되지 않습니다.';
      case 'auth/weak-password':
        return "비밀번호는 6글자 이상이어야 합니다.";
      default:
        return '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.';
    }
}

const pattern = /^[a-zA-Z0-9._%+-]+@soongsil\.net$/;
function emailValidChk(email) {
  if (pattern.test(email) === false) {
    return false;
  } else {
    return true;
  }
}

async function submit() {
  if (email.value.length === 0) {
    alert('이메일을 입력해주세요');
    return;
  }
  const email_full = email.value + "@soongsil.net"
  if (!emailValidChk(email_full)) {
    alert('이메일이 유효하지 않습니다');
    return;
  }
  if (password.value.length === 0) {
    alert('비밀번호를 입력해주세요');
    return;
  }

  buttonDisable.value = true;
  try {
    await signUp(email_full, password.value);
    createHash(email_full, password.value);
    alert('성공적으로 회원가입되었습니다. 이메일 인증을 완료해주세요.');
    router.push({ name: 'Auth', params: { type: 'verification' } });
  } catch (error) {
    var errorCode = error.code;
    var errorMessage = getErrorMessage(errorCode);
    alert(errorMessage);
  }
  buttonDisable.value = false;
}

function createHash(email, password) {
    const hash = CryptoJS.SHA256(email + password);
    const hashString = hash.toString(CryptoJS.enc.Hex);

    $cookies.set("userHash", hashString, "365d");
}

onMounted(() => {
  // 페이드 인 애니메이션 트리거
  const fadeInElements = document.querySelectorAll('.fade-in');
  fadeInElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add('visible');
    }, index * 200); // 각 요소마다 0.2초 지연
  });
});
</script>

<style scoped>
@media (max-width: 768px) {
  .logo {
    font-size: 30px;
    color: white;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .logo {
    font-size: 40px;
    color: white;
  }
}

@media (min-width: 1025px) {
  .logo {
    font-size: 50px;
    color: white;
  }
}

.img-logo {
  margin-right: 20px;
  width: 20%;
  max-width: 100px;
  height: auto;
}

.highlight {
  color: var(--p3);
}

.background {
  background-image: linear-gradient(to bottom, var(--p1), var(--b3));
  width: calc(100% - 40px);
  height: 150vh;
  display: flex;
  align-items: center;
  justify-content: baseline;
  flex-direction: column;
  padding: 50px 20px;
}

.title {
  font-size: 35px;
  color: var(--b1);
  margin-bottom: 50px;
}

.input-password {
  border: none;
  border-radius: 15px;
  width: 200px;
  height: 30px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--p3);
  margin-bottom: 20px;
  padding: 0px 10px;
}

.input-container {
  display: flex;
  align-items: center;
  border-radius: 15px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--p3);
  margin-bottom: 20px;
  padding: 0 0px;
}

.email-input {
  border: none;
  flex: 1;
  height: 30px;
  padding: 0px 10px;
  border-radius: 15px 0px 0px 15px;
  width: 130px;
}

.email-suffix {
  color: var(--p3);
  font-weight: bold;
  padding: 0px 10px;
}

.submit {
  border: none;
  height: 30px;
  border-radius: 10px;
  background-color: var(--p1);
  box-shadow: 0px 3px 7px var(--p3);
  color: var(--b1);
  font-size: 15px;
  padding: 0px 10px;
  margin-top: calc(10vb - 30px);
}

.submit-loading {
  background-color: grey;
}

.link {
  margin-bottom: 20px;
  border: none;
  background-color: transparent;
  color: var(--b2);
  text-decoration: underline;
}

.fade-in {
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.fade-in.visible {
  opacity: 1;
}

.delay-200 {
  transition-delay: 0.2s;
}

.result-container {
  box-shadow: 0px 3px 5px var(--b4);
  background-color: #ffffff;
  border-radius: 10px;
  width: 50vw;
  height: 30px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration-line: none;
}
ul {
  padding-left: 20px;
  padding-right: 20px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0)); /* for Webkit browsers */
  position: relative; /* or another appropriate value */
  z-index: 1; /* adjust as needed */
}
.result-url {
  color: var(--p3);
  font-size: 15px;
  text-align: left;
}
.result-tag {
  background-color: #a08797;
  border-radius: 15px;
  padding-top: 3px;
  padding-bottom: 3px;
  margin-left: 7px;
  flex-basis: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  color: var(--b1);
}
.result-tag1 {
  background-color: var(--p1);
}
.result-tag2 {
  background-color: var(--p3);
}
</style>



