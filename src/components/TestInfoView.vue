<template>
  <div class="container">
    <h1>Test Information</h1>
    <p>Name: {{ testName }}</p>
    <ul v-if="fileList.length">
      <li v-for="(item, index) in fileList" :key="index">
        <button @click="download(item.url, item.name)">
          {{ item.name }}
        </button>
      </li>
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
</style>
