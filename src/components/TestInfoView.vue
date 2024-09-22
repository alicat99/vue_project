<template>
  <div class="container">
    <div class="title font-title">{{ testName }}</div>

    <div
      class="riro-switch"
      style="
        width: max-content;
        height: auto;
        margin: 0 auto;
        position: relative;
        z-index: 1;"
      v-on:click="riroSwitchClick"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: center;"
      >
        <div
          class="riro-switch-item"
          :style="{
            'color': !riroSwitch ? 'white' : 'var(--b4)'
          }"
        >
          리로스쿨에서 보기
        </div>
        <div
          class="riro-switch-item"
          :style="{
            'color': riroSwitch ? 'white' : 'var(--b4)'
          }"
        >
          숭실US에서 보기
        </div>
      </div>

      <div
        :class="{
          'riro-switch-enable': riroSwitch,
          'riro-switch-disable': !riroSwitch,
        }"
        style="
          width: 140px; 
          height: calc(100% - 10px);
          border-radius: 10px;
          position: absolute; 
          top: 50%;
          left: 5px;
          z-index: -1;
          transition: all 0.5s ease;
        ">
      </div>
    </div>

    <ul v-if="fileList.length" class="file-container">
      <div v-for="(item, index) in fileList" :key="index">
        <button
          class="file"
          style="transition: all 0.5s ease;"
          :style="{
            'background-color': riroSwitch ? 'var(--p2)' : 'var(--riro)',
            'box-shadow': riroSwitch ? '0px 3px 7px var(--b4)' : '0px 0px 0px var(--b4)',
          }"
          @click="openUrl(item.url)"
        >
          {{ item.name }}
        </button>
      </div>
    </ul>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
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

  const riroSwitch = ref(false);

  async function download(url, name) {
    try {
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
  
  function openUrl(url) {
    window.open(url, '_blank');
  }

  function riroSwitchClick() {
    riroSwitch.value = !riroSwitch.value;
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
  color: white;
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
.riro-switch {
  border: none;
  border-radius: 15px;
  padding-left: 10px;
  padding-right: 10px;
  padding-top: 10px;
  padding-bottom: 10px;
  color: var(--p3);
  box-shadow:inset 0px 3px 10px var(--b4);
}
.riro-switch-disable {
  transform: translate3d(0, -50%, 0);
  background-color: var(--riro);
  
}
.riro-switch-enable {
  transform: translate3d(calc(100% - 10px), -50%, 0);
  background-color: var(--p2);
}
.riro-switch-item{
  width: 130px;
  transition: color 0.5s ease;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* 인터넷익스플로러 */
  user-select: none;
}
</style>
