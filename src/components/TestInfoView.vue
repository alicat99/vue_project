<template>
  <div class="container">
    <div class="title font-title">{{ testName }}</div>
    <ul v-if="fileList.length && userData != null" class="file-container">
      <div v-for="(item, index) in fileList" :key="index">
        <button class="file" @click="download(item.url, item.name)" :class="{ 'downloading': isDownloading[item.name] }">
          {{ item.name }}
        </button>
      </div>
    </ul>
    <div v-if="userData == null && isInitiated">
      파일을 다운로드하려면 로그인이 필요합니다
      <br>
      <br>
      <button @click="linkToLogin" v-if="isInitiated && userData == null" class="login font-title">
          로그인
      </button>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { getTestInfo } from './BackendRequest';
  import axios from 'axios';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';

  const route = useRoute()
  const router = useRouter()
  const testName = ref('')
  const fileList = ref([])

  const auth = firebase.auth();
  const userData = ref(null);
  const isInitiated = ref(false);
  
  const isDownloading = ref({});

  async function download(url, name) {
    try {
      isDownloading.value[name] = true; // 다운로드 중임을 표시
      setTimeout(() => {
        isDownloading.value[name] = false; // 3초 후 다운로드 중이 아님으로 변경
      }, 1000);

      const token = await userData.value.getIdToken(true);
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'blob',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', name);
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error('An error occurred while downloading the file:', error);
    }
  }

  function linkToLogin() {
    router.push({name: "Auth", params: {type: "login"}});
  }

  onMounted(async () => {
    if (route.params && route.params.id) {
      const id = route.params.id
      const info = await getTestInfo(id)
      
      testName.value = info.name

      fileList.value = info.files
    }
  })

  auth.onAuthStateChanged((user) => {
    isInitiated.value = true;
    userData.value = user;
  });
</script>

<style scoped>
.title {
  font-size: 20px;
  color: var(--p3);
  margin-top: 30px;
  margin-bottom: 30px;
}
.file-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding: 10px;
}
.file {
  border: none;
  border-radius: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 20px;
  background-color: white;
  color: var(--p3);
  box-shadow: 0px 3px 7px var(--b4);
}
.login {
  background-color: var(--p1);
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  color: var(--p3);
  font-size: 18px;
}
.file.downloading {
  background-color: gray;
}
</style>
