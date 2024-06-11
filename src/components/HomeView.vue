<template>
  <div class="container">
    <div class="input-container">
      <div class="input-item">
        <input v-model="inputValue" autocomplete="off" @keydown.enter="submit">
        <button @click="submit" class="submit">검색</button>
      </div>
    </div>

    <ul v-if="resultList.length">
      <div v-for="(item, index) in resultList" :key="index" class="result-container">
        <router-link :to="{ name: 'Info', params: { id: item.name }}" class="result-url">
          {{ item.name }}
        </router-link>
        <span v-if="item.problem" class="result-tag result-tag1">문제</span>
        <span v-if="item.answer" class="result-tag result-tag2">정답</span>
      </div>
    </ul>

    <div v-if="!resultList.length && queried">
      검색 결과가 없습니다...
    </div>
    <div v-if="!queried">
      검색어를 입력해주세요.<br>
      예) 1학기 기말 한국사, 2학년 물리학1
    </div>

  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { findTest, getTestData } from './BackendRequest';

  const inputValue = ref('');
  const resultList = ref([]);
  const queried = ref(false);

  const route = useRoute();
  const router = useRouter();

  async function submit() {
    if (inputValue.value.length == 0) return;
    router.push({name: "Home", query: {"query": inputValue.value}})
    const query = inputValue.value
    inputValue.value = query;
    const result = await findTest(query);
    resultList.value = result;
    queried.value = true;
  }

  onMounted(async () => {
    await getTestData();
    
    if (!route.query || !route.query.query) return;
    const query = route.query.query;
    inputValue.value = query;
    const result = await findTest(query);
    resultList.value = result;
    queried.value = true;
  })
</script>

<style scoped>
.container {
  padding-top: 10px;
  color: #a08797;
}
.input-container {
  height: 100px;
  display: flex;
  align-items: center;
}
.input-item {
  margin: 0 auto;
  border-radius: 10px;
  height: 30px;
  background-color: white;
  box-shadow: 0px 3px 7px var(--b4);
  padding: 0px;
  display: flex;
}
input {
  border: none;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  height: 100%;
  width: 50vw;
  background-color: transparent;
  flex-grow: 1;
  padding-left: 5px;
}
.submit {
  border: none;
  height: 100%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: var(--p1);
  color: var(--b1);
  flex-shrink: 0;
}
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
  padding-top: 3px;
  padding-bottom: 3px;
  padding-right: 7px;
  padding-left: 7px;
  margin-left: 7px;
  color: var(--b1);
}
.result-tag1 {
  background-color: var(--p1);
}
.result-tag2 {
  background-color: var(--p3);
}
</style>
