<template>
  <div class="viewport">
    <div class="container" v-if="type != 'verification'">
      <div class="title">
        <div v-if="type == 'login'">로그인</div>
        <div v-if="type == 'register'">회원가입</div>
      </div>
      <div>
        <input placeholder="이메일을 입력하세요" id="username" v-model="email">
      </div>
      <div>
        <input placeholder="비밀번호를 입력하세요" id="password" type="password" v-model="password">
      </div>
      <button class="submit" @click="submit">
        <div v-if="type == 'login'">로그인</div>
        <div v-if="type == 'register'">회원가입</div>
      </button>
      
      <button class="link" @click="link">
        <div v-if="type == 'login'">회원가입을 하지 않았나요?</div>
        <div v-if="type == 'register'">이미 가입했나요?</div>
      </button>
    </div>
  </div>
  
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  import { useRoute, useRouter } from 'vue-router';

  const email = ref('');
  const password = ref('');
  const type = ref('');
  
  const route = useRoute();
  const router = useRouter();

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
    if (!emailValidChk(email.value)) {
      alert('이메일이 유효하지 않거나 soongsil.net의 이메일이 아닙니다');
      return;
    }
    if (password.value.length == 0) {
      alert('비밀번호를 입력해주세요');
      return;
    }

    if (type.value == 'login') {
      try {
        const user = await signIn(email.value, password.value);

        if (!user.emailVerified) {
          router.push({name: "Auth", params: {type: "verification"}});
        }
      }
      catch(error) {
        alert("이메일이 등록되지 않았거나 비밀번호가 올바르지 않습니다")
      }
    }
    else if (type.value == 'register') {
      try {
        const user = await signUp(email.value, password.value);

        if (!user.emailVerified) {
          router.push({name: "Auth", params: {type: "verification"}});
        }
      }
      catch(error) {
        var errorCode = error.code;
        var errorMessage = getErrorMessage(errorCode);
        alert(errorMessage);
      }
    }
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

  const auth = firebase.auth();

  async function signUp(email, password) {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user
  }

  async function signIn(email, password) {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;
    return user
  }

  async function signOut() {
    await auth.signOut();
  }

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
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
    }
    router.push({name: "Home"});
  })
</script>

<style scoped>
.container {
  background-color: var(--b1);
  border-radius: 10px;
  box-shadow:inset 0px 3px 10px var(--b4);
  width: 70vw;
  height: 50vh;
  margin: 10vh auto;
  display: flex;
  align-items: center;
  justify-content: baseline;
  flex-direction: column;
  padding: 20px 20px;
}
.title {
  font-family: 'Black Han Sans';
  font-size: 30px;
  color: var(--p3);
  margin-top: 30px;
  margin-bottom: 30px;
}
input {
  border: none;
  border-radius: 15px;
  width: 200px;
  height: 30px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--b4);
  margin-bottom: 20px;
  padding: 0px 10px;
}
.submit {
  border: none;
  height: 30px;
  width: 70px;
  border-radius: 10px;
  background-color: var(--p1);
  box-shadow: 0px 3px 7px var(--b4);
  color: var(--b1);
  font-family: 'Black Han Sans';
  margin-top: 30px
}
.link {
  margin-top: 20px;
  border: none;
  background-color: transparent;
  color: gray;
  text-decoration: underline;
}
</style>
