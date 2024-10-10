<template>
  <div class="container">

    <search-bar-element @submit="submit" ref="searchBar"></search-bar-element>

    <div v-if="!queried" style="margin-bottom: 30px;">
      숭실고등학교의 기출문제 모음 사이트입니다.<br><br>
      검색어를 입력해주세요.<br>
      예) 1학기 기말 한국사, 2학년 물리학1
    </div>

    <result-list-element v-model:result-list="resultList"></result-list-element>

    <div v-if="!resultList.length && queried">
      검색 결과가 없습니다...
    </div>

  </div>
</template>

<script setup>
import SearchBarElement from './element/SearchBarElement.vue';
import ResultListElement from './element/ResultListElement.vue';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { findTest, getTestData } from './BackendRequest';

const searchBar = ref(null);

const resultList = ref([]);
const queried = ref(false);

const route = useRoute();
const router = useRouter();

async function submit(inputValue) {
  router.push({name: "Home", query: {"query": inputValue}})
  const query = inputValue
  inputValue = query;

  await updateResult(query);
}

async function updateResult(query) {
  const result = await findTest(query);
  resultList.value = result;
  queried.value = query.length > 0;
}

onMounted(async () => {
  await getTestData();
  
  const query = route.query.query ?? '';
  
  if (searchBar.value) {
    searchBar.value.setValue(query);
  }

  await updateResult(query);
})
</script>

<style scoped>
.container {
  padding-top: 10px;
  color: #a08797;
}
</style>
