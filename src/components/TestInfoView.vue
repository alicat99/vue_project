<template>
  <div class="container">
    <div class="title font-title">{{ testName }}</div>
    <ul v-if="fileList.length" class="file-container">
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
</style>
