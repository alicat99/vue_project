<template>
  <div class="container">
    <div class="title">{{ testName }}</div>
    <ul v-if="fileList.length">
      <div v-for="(item, index) in fileList" :key="index">
        <button class="file" @click="download(item.url, item.name)">
          {{ item.name }}
        </button>
      </div>
    </ul>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getTestInfo } from './BackendRequest';
  import axios from 'axios';

  const route = useRoute()
  const testName = ref('')
  const fileList = ref([])

  async function download(url, name) {
    try {
      const response = await axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
      });
      const fileURL = window.URL.createObjectURL(new Blob([response.data]));
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', name); // file name
      document.body.appendChild(fileLink);
      fileLink.click();
      document.body.removeChild(fileLink);
    } catch (error) {
      console.error('An error occurred while downloading the file:', error);
    }
  }

  onMounted(async () => {
    if (route.params && route.params.id) {
      const id = route.params.id
      const info = await getTestInfo(id)
      
      testName.value = info.name

      fileList.value = info.files
    }
  })
</script>

<style>
.title {
  font-family: 'Black Han Sans';
  font-size: 30px;
  color: var(--p3);
  margin-top: 30px;
  margin-bottom: 30px;
}
.file {
  border: none;
  border-radius: 15px;
  padding-left: 10px;
  padding-right: 10px;
  margin: 10px;
  height: 30px;
  background-color: white;
  color: var(--p3);
  box-shadow: 0px 3px 7px var(--b4);
}
</style>
