<template>
  login
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const axios = require('axios');

const route = useRoute();

const proxyURL = "https://soongsilus.onrender.com/"

async function getSession() {
  try {
    const data = {
      "id": "alicat9912374@gmail.com1",
      "pw": "tfgt5465R!",
    }
    
    const response = await axios.postForm(proxyURL + "login", data)
    console.log(response);
    //const session = response.data.session;
  } catch (error) {
    console.error('Error:', error);
  }
}

onMounted(() => {
  getSession();
})
</script>

<style scoped>
</style>
