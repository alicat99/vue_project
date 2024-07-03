<template>
  <ul v-if="resultList.length">
    <div v-for="(item, index) in resultList" :key="index" class="result-container">
      <router-link :to="{ name: 'Info', params: { id: item.name }}" class="result-url">
        {{ item.name }}
      </router-link>
      <button
        v-if="item.problem != null"
        class="result-tag result-tag1"
        @click="download(item.problem.url, item.problem.name)"
        :style="{ backgroundColor: buttonStates[`${item.problem.url}_${item.problem.name}`] !== undefined ? (buttonStates[`${item.problem.url}_${item.problem.name}`] ? 'gray' : '') : '' }"
      >
        문제
      </button>
      <button
        v-if="item.answer != null"
        class="result-tag result-tag2"
        @click="download(item.answer.url, item.answer.name)"
        :style="{ backgroundColor: buttonStates[`${item.answer.url}_${item.answer.name}`] !== undefined ? (buttonStates[`${item.answer.url}_${item.answer.name}`] ? 'gray' : '') : '' }"
      >
        정답
      </button>
    </div>
  </ul>
</template>

<script setup>
  import { defineProps, defineEmits, computed, ref } from 'vue';
  import firebase from 'firebase/compat/app';
  import 'firebase/compat/auth';
  import axios from 'axios';

  const auth = firebase.auth();
  const userData = ref(null);
  const isInitiated = ref(false);
  
  const buttonStates = ref({});

  const props = defineProps({
    resultList: {
      type: Array,
      required: true
    }
  });

  const emit = defineEmits(['update:resultList']);

  const resultList = computed({
    get: () => props.resultList,
    set: (value) => emit('update:resultList', value)
  });

  async function download(url, name) {
    if (!isInitiated.value) {
      alert("잠시 후 다시 시도해주세요");
      return;
    }
    if (userData.value == null) {
      alert("로그인 후 다운로드하실 수 있습니다");
      return;
    }
    try {
      buttonStates.value[`${url}_${name}`] = true;
      setTimeout(() => {
        buttonStates.value[`${url}_${name}`] = false;
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
  
  auth.onAuthStateChanged((user) => {
    isInitiated.value = true;
    userData.value = user;
  });
</script>

<style scoped>
.result-container {
  box-shadow: 0px 3px 5px var(--b4);
  background-color: #ffffff;
  border-radius: 10px;
  width: calc(100% - 20px);
  height: 30px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  padding: 10px;
}
ul {
  padding-left: 20px;
  padding-right: 20px;
}
.result-url {
  color: var(--p3);
  font-size: 15px;
  text-align: left;
  text-decoration-line: none;
}
.result-tag {
  background-color: #a08797;
  border-radius: 15px;
  border: none;
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