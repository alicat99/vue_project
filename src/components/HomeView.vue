<template>
  <div class="container">
    <input v-model="inputValue" @keydown.enter="submit">
    <button @click="submit">Submit</button>

    <ul v-if="resultList.length">
      <router-link v-for="(item, index) in resultList" :key="index" :to="{ name: 'Info', params: { id: item.id }}">
        <li>{{ item.name }} - {{ item.id }}</li>
      </router-link>
    </ul>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import { findTest } from './BackendRequest';

  const inputValue = ref('')
  const resultList = ref([])

  async function submit() {
    const message = inputValue.value
    const result = await findTest(message)
    resultList.value = result
    inputValue.value = ''
  }
</script>

<style>
</style>
