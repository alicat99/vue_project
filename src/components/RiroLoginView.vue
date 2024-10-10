<template>
  <div style="margin-top: 30px;" v-if="isFirst">
    기출문제 조회 시<br>
    최초 1회 로그인이 필요합니다. 😺
  </div>

  <panel-element-a class="container">
    <div class="renewal_signin_wrap">
      <div class="top_section">
        <img class="logo" src="https://cdn.riroschool.kr/assets/img/reLogin/logo_ic.svg" alt="logo" width="30px">
        <div class="text">
          <p>안녕하세요!</p>
          <p><strong>숭실고</strong> 리로스쿨입니다.</p>
        </div>
      </div>
      <div class="contents">
        <div class="signin_form">
          <div class="id_input">
            <input class="input_normal" type="text" id="id" placeholder="학교 아이디" autocomplete="new-password" v-model="id">
          </div>
          <div class="password_input">
            <input class="input_normal" type="password" id="pw" placeholder="비밀번호" autocomplete="new-password" v-model="pw" @keydown.enter="login">
          </div>
          <button class="button_normal" type="button" @click="login">로그인</button>
        </div>
      </div>
    </div>
  </panel-element-a>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PanelElementA from './element/PanelElementA.vue';

const axios = require('axios');
const proxyURL = "https://soongsilus.onrender.com/"

const route = useRoute();
const router = useRouter();
const $cookies = inject('$cookies');

const id = ref("");
const pw = ref("");

const isFirst = ref(true);

async function login() {
  if (id.value.length == 0) {
    alert('아이디를 입력해주세요');
    return;
  }
  if (pw.value.length == 0) {
    alert('비밀번호를 입력해주세요');
    return;
  }

  try {
    const data = {
      "id": id.value,
      "pw": pw.value,
    }
    
    const response = await axios.postForm(proxyURL + "login", data)
    const session = response.data.session;
    if (!session) {
      if (id.value.includes('@')) {
        alert(response.data.msg + '\n\n(입력하신 아이디가 **리로스쿨** 아이디인지 확인해주세요)');
      }
      else {
        alert(response.data.msg);
      }
      return;
    }
    alert('성공적으로 로그인하였습니다');

    $cookies.set("riroSession", window.btoa(session), "365d");
  }
  catch (error) {
    console.error('Error:', error);
    alert('현재 서비스 연결 상태가 좋지 않습니다. 나중에 다시 시도해주세요.');
    return;
  }
  
  if (route.query.redirect) {
    location.href = window.atob(route.query.redirect);
  }
  else {
    router.push({name: 'Home'});
  }
}

onMounted(() => {
  if ($cookies.get("riroSession")) {
    isFirst.value = false;
  }
})
</script>

<style scoped>
.container {
  width: min(70vw, 500px);
  height: max(400px, 50vh);
  margin: 30px auto;
  padding: 10px 10px;
  display: flex;
  justify-content: center;
}

.title {
  margin-top: 10px;
  margin-bottom: 30px;

  font-size: 20px;
  color: gray;
  font-weight: 700;
}

.input {
  height: 20px;
  margin-top: 20px;
}

.button {
  padding: 5px 10px;
  margin-top: 40px;
}

.renewal_signin_wrap {
  -webkit-text-size-adjust: none;
  text-align: center;
  text-shadow: none;
  padding: 30px 0 31px;
  min-height: 658px;
  box-sizing: border-box;
  width: 100%;
}

.top_selection {
  padding: 0 130px;
}

.contents {
  font-family: "맑은 고딕", "Malgun Gothic" ,"애플 SD 산돌고딕 Neo", "Apple SD Gothic Neo", sans-serif !important;
  letter-spacing: -0.5pt;
  font-size: 14px;
  line-height: 22px;
  color: #666;
  -webkit-text-size-adjust: none;
  text-align: center;
  text-shadow: none;
  margin-top: 30px;
  padding: 0 10%;
}

.signin_form {
  font-family: "맑은 고딕", "Malgun Gothic" ,"애플 SD 산돌고딕 Neo", "Apple SD Gothic Neo", sans-serif !important;
  letter-spacing: -0.5pt;
  font-size: 14px;
  line-height: 22px;
  color: #666;
  -webkit-text-size-adjust: none;
  text-align: center;
  text-shadow: none;
}

.id_input {
  font-family: "맑은 고딕", "Malgun Gothic" ,"애플 SD 산돌고딕 Neo", "Apple SD Gothic Neo", sans-serif !important;
  letter-spacing: -0.5pt;
  font-size: 14px;
  line-height: 22px;
  color: #666;
  -webkit-text-size-adjust: none;
  text-shadow: none;
  margin-bottom: 10px;
  text-align: left;
  overflow: hidden;
}

.input_normal {
  -webkit-text-size-adjust: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  text-shadow: none;
  margin: 0;
  appearance: none;
  box-sizing: border-box;
  text-transform: none;
  text-indent: 0;
  vertical-align: middle;
  line-height: 20px;
  background: #fff;
  width: 100%;
  height: 40px;
  padding: 18px;
  border-radius: 4px;
  border: 1px solid #dee2e6;
  background-color: #fff;
  color: #414141;
  font-size: 13px;
  cursor: pointer;
}

.button_normal {
  -webkit-text-size-adjust: none;
  -webkit-tap-highlight-color: transparent;
  text-shadow: none;
  border: none;
  font-family: Noto Sans KR, sans-serif;
  margin-top: 20px;
  width: 100%;
  height: 40px;
  padding: 10px 0;
  border-radius: 4px;
  background-color: #009ae6;
  color: #fff;
  font-size: 15px;
  cursor: pointer;
}

.text {
  font-family: "맑은 고딕", "Malgun Gothic" ,"애플 SD 산돌고딕 Neo", "Apple SD Gothic Neo", sans-serif !important;
  letter-spacing: -0.5pt;
  font-size: 17px;
  line-height: 10px;
  color: #666;
  -webkit-text-size-adjust: none;
  text-align: center;
  text-shadow: none;
}
</style>
