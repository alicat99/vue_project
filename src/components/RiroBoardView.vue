<template>
  hi
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

async function getUrl(url, prefix="https://soongsil.riroschool.kr/board.php?") {
  if (!url.startsWith(prefix)) {
    return
  }

  
  const response = await fetch('https://soongsil.riroschool.kr/ajax.php', {
    method: 'POST',
    body: new URLSearchParams({
      'app': 'user',
      'mode': 'login',
      'userType': '1',
      'id': 'id',
      'pw': 'pw',
      'deeplink': '',
      'redirect_link': ''
    })
  });

  console.log(response);

  const json = await response.json();
  console.log(json);
}

onMounted(() => {
  const url = route.query.url ?? '';

  getUrl(url);
})
</script>

<style scoped>
</style>
