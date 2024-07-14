<template>
  <!-- 
  <div>
    <input type="file" id="file" @change="handleFileUpload" hidden multiple/>
    <label for="file">
      file upload
    </label>
  </div>

  <button @click="tryEvent">event</button>
  -->
  <div class="container">
    <div class="font-title" style="font-size: 30px; margin-bottom: 10px;">성적인증하고 문상받자!</div>
    성적인증을 통해 아래 그림을 완성하면 <br>
    <div>문화상품권 <span class="font-title" style="font-size: 20px">1만원권</span>💵을 드립니다</div>
    
    <div class="grid-container" :class="{'grid-container-success': eventSuccess}" style="margin-top: 30px;">
      <div v-for="(visibility, index) in gridItemVisibility" :key="index" class="grid-item" :class="{'grid-item-visible': visibility}">
        <img :class="{'fade': gridItemFade[index]}" :src="require(`@/assets/tile_${index}.png`)" width="70px" height="70px" v-if="visibility"/>
      </div>
    </div>
    
    <br>
    {{ coinLeft }}🪙
    <button @click="tryEvent" style="margin-top: 10px" :class="{'event-button-loading': eventButtonType == 1}">
      {{ eventButtonMessages[eventButtonType] }}
      <span v-if="eventButtonType == 2">{{ eventCount }}🪙</span>
    </button>

    <DropdownMenuElement
      style="margin-top: 30px"
      showText="Q. 뽑기의 확률은 어떻게 되나요?"
      content="A. 뽑기를 했을 때 각 칸이 나올 확률은 9분의 1로 동일합니다. (소스코드: https://github.com/alicat99/vue_project)"
    />

    <div class="files-container" style="margin-top: 50px;">
      파일을 업로드하고 <span style="font-size: large; color: var(--p1)" class="font-title">{{ coinNext }}🪙</span>를 받으세요!
      <div style="color: gray; font-size: small;">첫 업로드: 3🪙, 두번째 업로드: 7🪙, 이후: 1🪙</div>
      <input type="file" id="file" @change="handleFileUpload" hidden multiple/>
      <label for="file" class="file-label" style="margin-top: 10px; margin-bottom: 10px;">
        성적 파일 업로드📃
        <div style="color: #dddddd; font-size: small;">(여러 파일을 동시에 업로드할 수 있어요)</div>
      </label>

      <div style="color: gray">
        - 업로드 된 파일 -
      </div>

      <div v-for="fileInfo in uploadedFiles" :key="fileInfo[0]" style="margin-top: 10px" class="file-item" :class="{'file-item-uploading': fileInfo[2] == 1, 'file-item-fail': fileInfo[2] == 2, 'file-item-success': fileInfo[2] == 3}">
        {{ fileInfo[1] }}
        <div v-if="fileInfo[2] == 2" style="font-size: small;">
          이유: {{ fileInfo[3] }}
        </div>
        <div v-if="fileInfo[2] == 3">
          이름: {{ fileInfo[3] }}
        </div>
      </div>
    </div>

    <div class="font-title" style="font-size: 30px; margin-top: 100px;">파일 업로드 방법</div>
    <br>
    <div>1. 리로스쿨 <span class="font-title" style="font-size: 20px">웹 </span> 버전에 접속합니다.</div>
    (앱 버전 X, 화면이 작아서 캡쳐하기 어렵습니다.)
    <a href="https://soongsil.riroschool.kr/" target='_blank'>https://soongsil.riroschool.kr/</a>
    <br>
    <br>
    2. 로그인 후 성적 및 입시 메뉴에 들어갑니다.
    <img src="@/assets/explain1.png" style="margin-top: 30px; width: min(70%, 400px)">
    <br>
    <br>
    3. 시험 이름과 성적 전체가 모두 나오도록 캡쳐해주세요.
    <div class="font-title">내신 성적만 업로드할 수 있습니다!<br>모의고사 성적은 업로드할 수 없으니 참고해주세요.</div>
    <DropdownMenuElement
      style="margin-top: 10px"
      showText="Q. 제 성적의 익명성이 유지되나요?"
      content="A. 네. 업로드한 성적 데이터의 주인은 암호화 기술을 사용하여 식별할 수 없게 저장됩니다. (소스코드: https://github.com/alicat99/vue_project)"
    />
    <img src="@/assets/explain2.png" style="margin-top: 30px; width: min(70%, 400px)">
    <br>
    <br>
    4. 캡쳐한 이미지를 업로드하고 보상을 받으세요!🪙
  </div>

  <div id="loading-overlay" v-if="!isInitiated">
    <div class="spinner"></div>
  </div>

  <div v-if="isPopupVisible" class="popup" @click.self="closePopup">
    <div class="popup-content">
      <span class="close" @click="closePopup">&times;</span>
      <h2 class="font-title">상품 수령</h2>
      축하합니다!<br>
      문화상품권 1만원권을 수령하실 수 있습니다!<br><br>
      아래에 전화번호를 적어 주시면 문화상품권을 문자로 전송해드리겠습니다!<br>
      <input style="border-radius: 10px" v-model="inputPhoneNumber" autocomplete="off" @keydown.enter="setNumber"/>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue';
import JSConfetti from "js-confetti";
import DropdownMenuElement from './element/DropdownMenuElement.vue';

const awsUploadUrl = 'https://qjyiqzal3k.execute-api.ap-northeast-2.amazonaws.com/default/uploadScore';
const awsEventUrl = 'https://qw8qr9zgsl.execute-api.ap-northeast-2.amazonaws.com/default/uploadEvent';

async function handleFileUpload(event) {
  const files = event.target.files;
  const keys = [];
  for (let i = 0; i < files.length; i++) {
    const key = uploadedFiles.value.length
    uploadedFiles.value.unshift([
      key,
      "업로드 중...(10초 이상 걸릴 수 있어요)",
      1,
    ])
    keys.push(key);
  }
  for (let i = 0; i < files.length; i++) {
    await uploadFile(files[i], keys[i]);
  }
}

async function uploadFile(file, key) {
  if (!isInitiated.value) {
    alert('잠시 후 다시 시도해주세요');
    return;
  }
  if (userData.value == null) {
    alert('회원가입 후 이벤트에 참여하실 수 있습니다');
    router.push({name: "Auth", params: {type: "register"}, query: {redirect: 'Upload'}});
    return;
  }

  const formData = new FormData();
  formData.append('image', file);

  const idToken = await userData.value.getIdToken(true);
  formData.append('idToken', idToken);
  const userHash = $cookies.get('userHash');
  formData.append('userHash', userHash);

  try {
    const response = await fetch(awsUploadUrl, {
      method: 'POST',
      body: formData,
    });

    const fileIndex = uploadedFiles.value.findIndex(element => element[0] == key);
    const data = await response.json();
    if (response.ok) {
      console.log('File uploaded successfully', data);

      let appendix;
      if (coinNext.value == 3) {
        appendix = `+${coinNext.value}🪙(첫 업로드)`
      }
      else if (coinNext.value == 7) {
        appendix = `+${coinNext.value}🪙(두번째 업로드)`
      }
      else {
        appendix = '+1🪙'
      }
      
      uploadedFiles.value[fileIndex][1] = '업로드 성공! ' + appendix;
      uploadedFiles.value[fileIndex][2] = 3;
      uploadedFiles.value[fileIndex].push(data.message);

      await getUserDoc(userData.value);
    } else {
      console.log('File upload failed', data);

      const errorTable = {
        'IdTokenMissing': '로그인 만료됨',
        'UserHashMissing': '로그인 만료됨',
        'EmailUnverified': '인증되지 않은 이메일',
        'DomainError': '인증되지 않은 이메일\n(숭실고 계정이 아니거나 선생님 계정입니다)',
        'RateLimit': '너무 빠른 업로드 요청\n(1시간 뒤에 다시 시도해주세요)',
        'SubmissionLimit': '최대 업로드 한도 도달',
        'DuplicateFile': '이미 업로드한 파일',
        'ParseError': '점수 인식 오류\n(이미지에 성적 전체가 나오는지 확인해주세요)\n(모의고사 성적은 입력할 수 없으니 확인해주세요)',
      }

      uploadedFiles.value[fileIndex][1] = "업로드에 실패하였습니다...";
      uploadedFiles.value[fileIndex][2] = 2;
      uploadedFiles.value[fileIndex].push(errorTable[data.message]);
    }
  } catch (error) {
    console.error('Error uploading file:', error);

    const fileIndex = uploadedFiles.value.findIndex(element => element[0] == key);
    uploadedFiles.value[fileIndex][1] = "오류가 발생했습니다...";
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const eventButtonType = ref(0);
const eventButtonMessages = [
  '뽑기 도전 🪙',
  '로딩중입니다...(10초 이상 걸릴 수 있어요)',
  '버튼을 눌러주세요! ',
]
let eventResults = []
const eventCount = ref(0);
const eventSuccess = ref(false);

async function tryEvent() {
  if (eventButtonType.value == 1) {
    return;
  }
  else if (eventButtonType.value == 0) {
    await getEvent();
  }
  else if (eventButtonType.value == 2) {
    await DoEvent();
  }
}

async function getEvent() {
  if (!isInitiated.value) {
    alert('잠시 후 다시 시도해주세요');
    return;
  }

  if (coinLeft.value == 0) {
    alert('코인(🪙)이 부족합니다!');
    return;
  }

  eventButtonType.value = 1;

  const formData = new FormData();

  const idToken = await userData.value.getIdToken(true);
  formData.append('idToken', idToken);
  const userHash = $cookies.get('userHash');
  formData.append('userHash', userHash);

  let data;
  try {
    const response = await fetch(awsEventUrl, {
      method: 'POST',
      body: formData,
    });

    data = await response.json();
    if (!response.ok) {
      console.log('Event trial failed', data);
      return;
    }
  } catch (error) {
    console.error('Error trying event:', error);
    return;
  }

  coinLeft.value = 0;

  eventResults = data['message'];
  eventCount.value = Object.keys(eventResults).length;

  eventButtonType.value = 2;
}

async function DoEvent() {
  const keys = Object.keys(eventResults)
  if (keys.length == 0) {
    eventButtonType.value = 0;
    return;
  }

  eventCount.value -= 1;

  const key = keys[0];
  const idx = eventResults[key];
  delete eventResults[key];

  gridItemFade.value[idx - 1] = false;

  await delay(1);
  
  gridItemVisibility.value[idx - 1] = true;
  gridItemFade.value[idx - 1] = true;
  
  if (keys.length == 1) {
    eventButtonType.value = 0;

    if (gridItemVisibility.value.find(item => item == false) === undefined) {
      await delay(400);
      eventSuccess.value = true;
      
      const jsConfetti = new JSConfetti(); 
      jsConfetti.addConfetti({
        confettiColors: [
          "#ff0a54",
          "#ff477e",
          "#ff7096",
          "#ff85a1",
          "#fbb1bd",
          "#f9bec7",
        ],
        confettiRadius: 5,
        confettiNumber: 500,
      });
    }

    getUserDoc(userData.value);
  }
}

const gridItemVisibility = ref([
  false, false, false,
  false, false, false,
  false, false, false,
]);

const gridItemFade = ref([
  false, false, false,
  false, false, false,
  false, false, false,
])

const uploadedFiles = ref([])

async function updateVisibility() {
  const acquired = userDoc.value.acquired_items ?? [];
  for (let i = 0; i < acquired.length; i++) {
    gridItemVisibility.value[acquired[i] - 1] = true;
  }

  const tests = userDoc.value['submitted_tests'] ?? {};
  const keys = Object.keys(tests).sort();
  let trueValue = 0;
  let falseValue = 0;
  for (let key in tests) {
    if (tests[key]) {
      trueValue += 1;
    }
    else {
      falseValue += 1;
    }
  }

  if (!isInitiated.value) {
    for (let key of keys) {
      uploadedFiles.value.unshift([
        uploadedFiles.value.length,
        key, 
        0,
      ]);
    }
  }
  
  let sumValue = 0;
  for (let i = trueValue; i < trueValue + falseValue && i < eventTrial.value.length; i++) {
    sumValue += eventTrial.value[i];
  }

  coinLeft.value = sumValue;
  coinNext.value = eventTrial.value[trueValue + falseValue] ?? 0;

  if (gridItemVisibility.value.find(item => item == false) === undefined) {
    await delay(500);
    openPopup();
  }
}

const $cookies = inject('$cookies');

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import "firebase/firestore";
import { useRouter } from 'vue-router';

const router = useRouter();

const auth = firebase.auth();

const userData = ref(null);
const isInitiated = ref(false);

const db = firebase.firestore();
const userDoc = ref({});
const coinLeft = ref(0);
const coinNext = ref(3);

const configs = ref({});
const eventTrial = ref([]);

auth.onAuthStateChanged(async (user) => {
  userData.value = user;

  const userHash = $cookies.get('userHash');
  if (userHash == null) {
    alert('로그인이 만료되었습니다. 다시 로그인해 주세요.');
    router.push({name: "Auth", params: {type: "login"}, query: {redirect: 'Upload'}});
    return;
  }

  await getConfigs();
  
  if (user != null) {
    await getUserDoc(user);
  }

  isInitiated.value = true;
});

async function getUserDoc(user) {
  const docId = user.uid;
  const docRef = db.collection('user').doc(docId);
  try {
    let doc = await docRef.get();
    if (doc.exists) {
      userDoc.value = doc.data();
    }
  }
  catch (err) {
    console.error(err);
  }
  updateVisibility();
  
  const docRef2 = db.collection('event').doc(docId);
  try {
    let doc2 = await docRef2.get();
    if (doc2.exists) {
      inputPhoneNumber.value = doc2.data().number ?? '';
    }
  }
  catch (err) {
    console.error(err);
  }
}

async function getConfigs() {
  const configsRef = db.collection('configs').doc('general');
  let configsData = await configsRef.get();
  if (!configsData.exists) {
    throw new Error();
  }
  configs.value = configsData.data();
  eventTrial.value = configs.value.event_trial;
}

const isPopupVisible = ref(false);

const openPopup = () => {
  isPopupVisible.value = true;
};

const closePopup = () => {
  isPopupVisible.value = false;
};

const inputPhoneNumber = ref('');

async function setNumber() {
  const docId = userData.value.uid;
  const docRef2 = db.collection('event').doc(docId);
  await docRef2.set({
    number: inputPhoneNumber.value
  })

  alert('문화상품권은 24시간 이내에 지정된 번호로 전송됩니다');

  closePopup();
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0px;
}
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 70px);
  grid-template-rows: repeat(3, 70px);
  gap: 5px;
}
.grid-container-success {
  animation: grid-container-success-keyframe 1s linear both;
}
@keyframes grid-container-success-keyframe {
  0% {
    gap: 5px;
  }

  100% {
    gap: 0px;
  }
}
.grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--b1);
  border: 3px solid #cccccc;
  font-size: 24px;
}
.grid-item-visible {
  background-color: black;
}
.fade {
  animation: fade-keyframe 1s linear both;
  opacity: 0;
}
@keyframes fade-keyframe {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
button {
  border: none;
  height: 30px;
  border-radius: 10px;
  background-color: var(--p1);
  box-shadow: 0px 3px 7px var(--b4);
  color: var(--b1);
  font-size: 15px;
  padding: 0px 10px;
}
.event-button-loading {
  background-color: gray;
}
.files-container {
  border-radius: 10px;
  box-shadow:inset 0px 3px 10px var(--b4);
  width: 70%;
  padding: 10px;
}
.file-label {
  display: block;
  border: none;
  border-radius: 10px;
  background-color: var(--p1);
  box-shadow: 0px 3px 7px var(--b4);
  color: var(--b1);
  font-size: 15px;
  padding: 10px 10px;
}
#loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
.spinner {
  border: 10px solid #f3f3f3;
  border-top: 10px solid var(--p1);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
}
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
.file-item {
  padding: 5px;
  border-radius: 10px;
  background-color: var(--b2);
  white-space: pre-line;
}
.file-item-uploading {
  background-color: gray;
}
.file-item-fail {
  background-color: red;
  color: white;
}
.file-item-success {
  background-color: greenyellow;
}
.popup {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.5);
}
.popup-content {
  background-color: white;
  margin: 15% auto;
  padding: 20px;
  border: none;
  border-radius: 10px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
}
.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>
