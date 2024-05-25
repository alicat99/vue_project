<template>
  <div class="container">
    <h1>Test Information</h1>
    <p>Name: {{ testName }}</p>
    <ul v-if="fileList.length">
      <li v-for="(item, index) in fileList" :key="index">
        <a v-bind:href="item.url" v-bind:download="item.name">
          {{ item.name }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import { getTestInfo } from './BackendRequest';

  const route = useRoute()
  const testName = ref('')
  const fileList = ref([])

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
