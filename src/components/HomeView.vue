<template>
  <div class="container">
    <input v-model="inputValue" @keydown.enter="submit">
    <button @click="submit">Submit</button>

    <ul v-if="resultList.length">
      <router-link v-for="(item, index) in resultList" :key="index" :to="{ name: 'Info', params: { id: item.name }}">
        <li>{{ item.name }}</li>
      </router-link>
    </ul>
    <div v-if="!resultList.length && queried">
      검색 결과가 없습니다...
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { findTest } from './BackendRequest';

  const inputValue = ref('');
  const resultList = ref([]);
  const queried = ref(false);

  const route = useRoute();
  const router = useRouter();

  async function submit() {
    router.replace({name: "Home", query: {"query": inputValue.value}})
    const query = inputValue.value
    inputValue.value = query;
    const result = await findTest(query);
    resultList.value = result;
    queried.value = true;
  }

  onMounted(async () => {
    if (!route.query || !route.query.query) return;
    const query = route.query.query;
    inputValue.value = query;
    const result = await findTest(query);
    resultList.value = result;
    queried.value = true;
  })
</script>

<style>
</style>
