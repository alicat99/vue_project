<template>
  <div class="container">
    <div v-if="riroState == 0">
      로딩중입니다
    </div>
    <div v-if="riroState == 1">
      로딩에 실패했습니다...<br>
      
      <br><br><br>
      <ButtonElementA @click="linkToLogin" class="button">리로스쿨에 다시 로그인</ButtonElementA>
    </div>
    <div v-if="riroState == 2">
      <div class="font-title title">{{ riroTitle }}</div>

      <div v-for="item in riroFileData" :key="item[3]">
        <button-element-a class="button" :class="{'button-highlight': item[5]}" use-pause @click="download(item[0], item[1], item[2], item[3])">
          {{ item[3] }}
        </button-element-a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, inject, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import ButtonElementA from './element/ButtonElementA.vue';

const route = useRoute();
const router = useRouter();
const $cookies = inject('$cookies');

const axios = require('axios');
const proxyURL = "https://soongsilus.onrender.com/"

let riroSession = null;

const riroState = ref(0);
const riroTitle = ref("");
const riroFileData = ref([]);

const targetName = ref("");

async function getUrl(url, prefix="https://soongsil.riroschool.kr/board.php?") {
  if (!url.startsWith(prefix)) {
    return;
  }
  
  let regex;
  let match;

  regex = /inum=(\d+)/;
  match = url.match(regex);
  if (!match) {
    return;
  }
  const inum = match[1];
  
  regex = /uid=(\d+)/;
  match = url.match(regex);
  if (!match) {
    return;
  }
  const uid = match[1];

  const data = {
    'uid': uid,
    'inum': inum,
    'session': riroSession,
  }
  
  let tableHTML;
  try {
    const response = await axios.postForm(proxyURL + "board", data);

    const session = response.data.session;
    tableHTML = response.data.table_html;
    if (!session || !tableHTML) {
      riroState.value = 1;
      return;
    }
    $cookies.set("riroSession", window.btoa(session), "365d");
  }
  catch (error) {
    console.error('Error:', error);
    riroState.value = 1;
    return;
  }

  if (parseHTML(tableHTML)) {
    riroState.value = 2;
  }
}

function parseHTML(html) {
  let match;

  const patternTitle = /<div style=['"]width:40%; font-weight:600; font-size:16px; float:left; {2}text-align:left; color:#333333; text-indent: 0;['"]>(.*?)<\/div>/;
  match = html.match(patternTitle);
  if (!match) {
    return false;
  }
  const title = match[1].trim();

  const patternFile = /javascript:bL\('down',.*?\)/g;
  match = html.match(patternFile);
  if (!match) {
    return false;
  }
  const files = [];
  match.forEach(item => {
    item = item.slice("javascript:bL('down',".length, -1);
    item = item.split(",");
    let res = [];
    item.forEach(i => {
      if (!isNaN(i)) {
        res.push(parseInt(i));
      } else {
        res.push(i.slice(1, -1));
      }
    });
    files.push(res);
  });

  const patternFile2 = /<font title=".*?">/g;
  match = html.match(patternFile2);
  if (!match) {
    return false;
  }
  const fileNames = [];
  match.forEach(item => {
    item = item.slice('<font title="'.length, -2);
    fileNames.push(item);
  });

  const fileData = [];
  for (let i = 0; i < files.length; i++) {
    fileData.push([...files[i], fileNames[i], Math.max(0, lcsLength(targetName.value, fileNames[i]) - 10), false]);
  }
  
  let M = Math.max(...fileData.map(i => i[4]));
  fileData.forEach(i => {
    i[5] = i[4] === M;
  });

  riroTitle.value = title;
  riroFileData.value = fileData;

  return true;
}

function lcsLength(str1, str2) {
  const len1 = str1.length;
  const len2 = str2.length;

  // 2D 배열 생성 및 초기화 (길이가 len1 + 1, len2 + 1인 배열 생성)
  const dp = Array.from(Array(len1 + 1), () => Array(len2 + 1).fill(0));

  // 동적 프로그래밍을 사용하여 LCS 길이 계산
  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // dp[len1][len2]는 두 문자열의 LCS 길이를 나타냄
  return dp[len1][len2];
}

function download(uid, fileNum, fileCode, fileName) {
  const data = {
    url: `https://soongsil.riroschool.kr/board.php?club=index&action=down&db=1042&page=&cate=&sort=&uid=${uid}&file_num=${fileNum}&file_code=${fileCode}`,
    session: riroSession,
  };

  const formData = new FormData();
  formData.append('url', `https://soongsil.riroschool.kr/board.php?club=index&action=down&db=1042&page=&cate=&sort=&uid=${uid}&file_num=${fileNum}&file_code=${fileCode}`);
  formData.append('session', riroSession);

  fetch(proxyURL + "download-proxy", {
    method: 'POST',
    body: formData // form-data로 데이터 전송
  })
  .then(response => response.blob()) // 파일 데이터를 blob 형태로 받아옴
  .then(blob => {
    // 브라우저에서 파일 다운로드
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.setAttribute('download', fileName); // 다운로드할 파일명 설정
    document.body.appendChild(link);
    link.click(); // 다운로드 트리거
    link.parentNode.removeChild(link); // 링크 제거
  })
  .catch(error => {
      console.error('Error during the request:', error);
  });
}

function linkToLogin() {
  router.push({name: 'RiroLogin', query: {'redirect': window.btoa(location.href)}});
}

onMounted(() => {
  riroSession = $cookies.get('riroSession');
  if (!riroSession) {
    router.push({name: 'RiroLogin', query: {'redirect': window.btoa(location.href)}});
    return;
  }
  riroSession = window.atob(riroSession);

  const url = route.params.url ? window.atob(route.params.url) : '';
  targetName.value = route.query.name ?? '';

  getUrl(url);
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.title {
  margin-bottom: 50px;
}

.button {
  margin-bottom: 20px;
  padding: 5px 10px;
}

.button-highlight {
  background-color: var(--p3) !important;
}
</style>
