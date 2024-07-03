<template>
  <div class="viewport" v-if="type === 'login' || type == 'verification'">
    <div class="container" v-if="type == 'login'">
      
      <div class="title font-title">
        <div v-if="type == 'login'">로그인</div>
        <div v-if="type == 'register'">회원가입</div>
      </div>

      <button class="link" @click="link">
        <div v-if="type == 'login'">처음이신가요?<span class="font-title" style="font-size: 20px">  회원가입하기</span></div>
        <div v-if="type == 'register'">이미 가입하셨나요?<span class="font-title" style="font-size: 20px">  로그인하기</span></div>
      </button>
      
      <div class="input-container">
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
          class="input-password"
        />
      </div>
      
      <button :class="{'submit': true, 'submit-loading': buttonDisable}" :disabled="buttonDisable" @click="submit">
        <div v-if="type == 'login'">로그인</div>
        <div v-if="type == 'register'">회원가입</div>
      </button>
    </div>

    <div class="container" v-if="type == 'verification'">
      {{ email }} 계정의 이메일 인증을 완료해주세요!
      <button :class="{'submit': true, 'submit-loading': buttonDisable}" :disabled="buttonDisable" @click="emailVerification">
        인증 메일 전송하기
      </button>
      <button :class="{'submit': true, 'submit-loading': buttonDisable}" :disabled="buttonDisable" @click="linkToLogout">
        로그아웃하기
      </button>
    </div>
  </div>
  
  <div v-if="type === 'register'">
    <SignUpView /> <!-- SignUpView 컴포넌트 추가 -->
  </div>
</template>

<script setup>
  import { ref, onMounted, inject } from 'vue';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  import { useRoute, useRouter } from 'vue-router';
  import CryptoJS from 'crypto-js';
  import SignUpView from './SignUpView.vue';
  
  const auth = firebase.auth();

  const email = ref('');
  const password = ref('');
  const type = ref('');
  const buttonDisable = ref(false);
  
  const route = useRoute();
  const router = useRouter();

  const $cookies = inject('$cookies');

  let isSignout = false;

  const pattern = /^[a-zA-Z0-9._%+-]+@soongsil\.net$/;
  function emailValidChk(email) {
      if(pattern.test(email) === false) { return false; }
      else { return true; }
  }

  async function submit() {
    if (email.value.length == 0) {
      alert('이메일을 입력해주세요');
      return;
    }
    const email_full = email.value + "@soongsil.net"
    if (!emailValidChk(email_full)) {
      alert('이메일이 유효하지 않습니다');
      return;
    }
    if (password.value.length == 0) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    buttonDisable.value = true;
    if (type.value == 'login') {
      try {
        const user = await signIn(email_full, password.value);
        
        createHash(email_full, password.value);

        if (!user.emailVerified) {
          alert("성공적으로 로그인되었습니다. 이메일 인증을 완료해주세요.")
          router.push({name: "Auth", params: {type: "verification"}});
        }
        else {
          alert("성공적으로 로그인되었습니다")
          router.push({name: "Home"});
        }
      }
      catch(error) {
        alert("로그인에 실패하였습니다. 이메일과 비밀번호를 확인해주세요.")
      }
    }
    /*
    else if (type.value == 'register') {
      try {
        await signUp(email.value, password.value);

        createHash(email.value, password.value);

        alert("성공적으로 회원가입되었습니다. 이메일 인증을 완료해주세요.")
        router.push({name: "Auth", params: {type: "verification"}});
      }
      catch(error) {
        var errorCode = error.code;
        var errorMessage = getErrorMessage(errorCode);
        alert(errorMessage);
      }
    }*/
    buttonDisable.value = false;
  }

  function createHash(email, password) {
    const hash = CryptoJS.SHA256(email + password);
    const hashString = hash.toString(CryptoJS.enc.Hex);

    $cookies.set("userHash", hashString, "365d");
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

  function link() {
    if (type.value == 'login') {
      router.push({name: "Auth", params: {type: "register"}});
    }
    else if (type.value == 'register') {
      router.push({name: "Auth", params: {type: "login"}});
    }
  }

  async function emailVerification() {
    buttonDisable.value = true;

    try {
      const user = auth.currentUser;
      await user.sendEmailVerification();
      alert("인증 메일이 전송되었습니다. 이메일을 확인해 주세요.")
    }
    catch {
      alert("인증 과정에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요.")
    }
    buttonDisable.value = false;
  }

  function linkToLogout() {
    router.push({name: "Auth", params: {type: "logout"}});
  }

  async function signIn(email, password) {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user
  }

  async function signOut() {
    await auth.signOut();
  }

  auth.onAuthStateChanged(async (user) => {
    if (type.value == "verification") {
      if (user == null) {
        router.push({name: "Auth", params: {type: "login"}});
        return;
      }
      if (user.emailVerified) {
        alert("이메일 인증이 완료되었습니다");
        router.push({name: "Home"});
        return;
      }

      email.value = user.email;
    }
    else if (type.value == "logout") {
      if (isSignout) {
        return;
      }

      if (user == null) {
        alert("이미 로그아웃 되었습니다");
      }
      else {
        try {
          isSignout = true;
          await signOut();
          alert("로그아웃되었습니다");
        }
        catch {
          alert("문제가 발생했습니다. 잠시 후 다시 시도해주세요.");
        }
      }

      router.push({name: "Home"});
    }
  });

  onMounted(async () => {
    if (route.params && route.params.type) {
      const value = route.params.type;
      if (value == "login") {
        type.value = value;
        return;
      }
      else if (value == "register") {
        type.value = value;
        return;
      }
      else if (value == "verification") {
        type.value = value;
        return;
      }
      else if (value == "logout") {
        type.value = value;
        return;
      }
    }
    router.push({name: "Home"});
  })
</script>

<style scoped>
.container {
  background-color: var(--b1);
  border-radius: 10px;
  box-shadow:inset 0px 3px 10px var(--b4);
  width: 70vi;
  height: 60vb;
  margin: 10vb auto;
  display: flex;
  align-items: center;
  justify-content: baseline;
  flex-direction: column;
  padding: 20px 20px;
}
.title {
  font-size: 35px;
  color: var(--p3);
  margin-top: 30px;
  margin-bottom: 15px;
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
  box-shadow: 0px 3px 7px var(--b4);
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
  color: gray;
  text-decoration: underline;
}
</style>
